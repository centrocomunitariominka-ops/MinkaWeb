# Configurar el panel de administrador (Clerk + Supabase)

## 1. Clerk — ya está listo ✅

Ya configuré todo esto por vos usando el CLI de Clerk, con tu cuenta
`centrocomunitariominka@gmail.com`:

- Se creó la app **"MINKA Web"** en Clerk.
- Se restringió el registro (`sign_up_mode: restricted`): **nadie puede crearse una cuenta nueva**, ni siquiera intentándolo.
- Se creó un único usuario administrador con el email `centrocomunitariominka@gmail.com`.
- El login es **sin contraseña**: al entrar a `/admin`, Clerk manda un código de 6 dígitos a ese email y con eso entrás.
- La clave pública ya quedó en `.env.local` (`VITE_CLERK_PUBLISHABLE_KEY`) — no la subas a git, ya está en `.gitignore`.
- Los tokens de sesión de Clerk llevan un claim `role: authenticated`, que es lo que Supabase necesita para reconocer que el pedido viene de alguien logueado (sin esto, Supabase trata todo como visitante anónimo y las políticas de RLS de escritura fallan). Ya está configurado.

No tenés que tocar nada de Clerk. Si en algún momento querés agregar un segundo admin, avisame y lo agrego con el CLI en 10 segundos.

## 2. Supabase — esto sí lo tenés que hacer vos

Supabase no tiene un login por CLI que pueda automatizar sin que generes un
token manualmente, así que estos pasos son tuyos (son rápidos, ~5 minutos).

### 2.1 Crear el proyecto

1. Andá a https://supabase.com/dashboard y creá una cuenta / iniciá sesión (podés usar `centrocomunitariominka@gmail.com` con Google).
2. **New Project** → nombre `minka-web` → generá una contraseña de base de datos (guardala en un lugar seguro, no la vamos a necesitar de nuevo) → región la más cercana (ej. South America - São Paulo) → **Create new project**. Tarda 1-2 minutos en aprovisionarse.

### 2.2 Crear la tabla, los permisos y el storage

1. En el menú lateral: **SQL Editor → New query**.
2. Pegá **todo** este bloque y tocá **Run**:

```sql
-- Tabla de blogs
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  body text not null,
  image_url text,
  pdf_url text,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;

-- Permisos de tabla (esto es un chequeo previo a las políticas de RLS de
-- abajo; sin esto, Postgres rechaza el pedido antes de mirar las políticas).
grant select on posts to anon;
grant select, insert, update, delete on posts to authenticated;

-- Cualquiera puede leer los blogs (la página pública)
create policy "Public can read posts"
on posts for select
to anon, authenticated
using (true);

-- Solo alguien logueado (o sea, vos) puede crear/editar/borrar
create policy "Authenticated can insert posts"
on posts for insert
to authenticated
with check (true);

create policy "Authenticated can update posts"
on posts for update
to authenticated
using (true);

create policy "Authenticated can delete posts"
on posts for delete
to authenticated
using (true);

-- Bucket para las fotos y PDFs
insert into storage.buckets (id, name, public)
values ('post-files', 'post-files', true)
on conflict (id) do nothing;

create policy "Public read post files"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'post-files');

create policy "Authenticated upload post files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'post-files');

create policy "Authenticated delete post files"
on storage.objects for delete
to authenticated
using (bucket_id = 'post-files');
```

Como solo tu cuenta de Clerk puede loguearse (nadie más puede registrarse),
"cualquiera autenticado" es lo mismo que "vos". Por eso no hace falta
verificar el email de nuevo acá.

### 2.3 Conectar Clerk como método de login de Supabase

Esto es lo que hace que Supabase entienda "esta persona ya inició sesión con Clerk".

1. En Supabase: **Authentication → Sign In / Providers → Third Party Auth** (el nombre exacto puede variar un poco según la versión del panel).
2. **Add provider** → elegí **Clerk**.
3. Como dominio, pegá la URL completa (con `https://`):
   ```
   https://noble-mollusk-6291.clerk.accounts.dev
   ```
4. Guardá.

### 2.4 Copiar las claves a tu proyecto

1. En Supabase: **Settings → API Keys**.
2. Copiá el **Project URL** y la **Publishable key** (`sb_publishable_...`).
   La **Secret key** (`sb_secret_...`) NO va acá — esa nunca se usa en el
   navegador porque se salta todos los permisos. Si ya la tenés a mano,
   guardala aparte en `.env.local` sin el prefijo `VITE_` (así Vite nunca la
   incluye en el sitio publicado), pero la app no la necesita para nada hoy.
3. Abrí el archivo `.env.local` en la raíz del proyecto (ya tiene las claves de Clerk) y agregá:

```
VITE_SUPABASE_URL=el Project URL que copiaste
VITE_SUPABASE_PUBLISHABLE_KEY=la Publishable key (sb_publishable_...)
```

### 2.5 Tabla para la portada (hero) editable

Esto habilita que desde el panel se pueda cambiar la imagen, el texto y el
color de fondo de la portada principal (el cuadrado de "Transformar la
realidad desde el barrio"), por ejemplo para subir una campaña temporal
(un festival, etc.).

1. **SQL Editor → New query**, pegá esto y tocá **Run**:

```sql
-- Tabla de la portada (hero) — una sola fila con id fijo 'main'
create table if not exists hero_campaign (
  id text primary key,
  active boolean not null default false,
  kicker text,
  headline text,
  body text,
  background text,
  image_url text,
  updated_at timestamptz not null default now()
);

alter table hero_campaign enable row level security;

grant select on hero_campaign to anon;
grant select, insert, update, delete on hero_campaign to authenticated;

create policy "Public can read hero campaign"
on hero_campaign for select
to anon, authenticated
using (true);

create policy "Authenticated can insert hero campaign"
on hero_campaign for insert
to authenticated
with check (true);

create policy "Authenticated can update hero campaign"
on hero_campaign for update
to authenticated
using (true);

create policy "Authenticated can delete hero campaign"
on hero_campaign for delete
to authenticated
using (true);
```

Las fotos de la portada se guardan en el mismo bucket `post-files` que las
de los blogs (dentro de una carpeta `hero/`), así que no hace falta crear
un bucket nuevo ni políticas de storage adicionales.

### 2.6 Tabla para los números de "Lo que construimos juntos"

Permite cambiar desde el panel los 5 números de la sección de impacto.
**SQL Editor → New query**, pegá esto y tocá **Run**:

```sql
create table if not exists site_stats (
  id text primary key,
  items jsonb not null,
  updated_at timestamptz not null default now()
);

alter table site_stats enable row level security;

grant select on site_stats to anon;
grant select, insert, update, delete on site_stats to authenticated;

create policy "Public can read site stats"
on site_stats for select
to anon, authenticated
using (true);

create policy "Authenticated can insert site stats"
on site_stats for insert
to authenticated
with check (true);

create policy "Authenticated can update site stats"
on site_stats for update
to authenticated
using (true);

create policy "Authenticated can delete site stats"
on site_stats for delete
to authenticated
using (true);
```

## 3. Agregar las variables en Vercel

Cuando hagamos el deploy: Vercel → tu proyecto → **Settings → Environment Variables** → cargá las 3 variables (`VITE_CLERK_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) para Production, Preview y Development. La Secret key de Supabase y la Secret key de Clerk no van en Vercel — no las necesita el sitio.

---

Avisame cuando termines el paso 2 (Supabase) y pruebo que el login, la carga de blogs y las fotos/PDF funcionen antes de subir nada.
