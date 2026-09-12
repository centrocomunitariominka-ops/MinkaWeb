import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, useClerk } from "@clerk/clerk-react";
import { FaSignOutAlt, FaTrash, FaEdit, FaFilePdf } from "react-icons/fa";

import logo from "../assets/logo.png";
import heroPhoto from "../assets/photos/hero.jpg";
import { useSupabase } from "../hooks/useSupabase";
import { getPosts } from "../lib/posts";
import { createPost, deletePost, updatePost } from "../lib/adminPosts";
import { getHeroCampaign } from "../lib/hero";
import { saveHeroCampaign } from "../lib/adminHero";
import { DEFAULT_HERO_BACKGROUND, getHeroBackgroundCss } from "../lib/heroBackgrounds";
import { formatPostDate } from "../lib/formatDate";
import { RichTextEditor } from "../components/RichTextEditor";
import "../App.css";
import "./Admin.css";

const EMPTY_FORM = { title: "", excerpt: "", body: "" };

const EMPTY_HERO_FORM = {
  active: false,
  kicker: "",
  headline: "",
  body: "",
  background: DEFAULT_HERO_BACKGROUND,
};

const DEFAULT_HERO_KICKER = "Tejemos redes solidarias para";
const DEFAULT_HERO_HEADLINE = "Transformar la realidad desde el barrio";
const DEFAULT_HERO_BODY =
  "En Minka creemos que la solidaridad se construye entre todos. Con tu apoyo, podemos seguir garantizando salud, educación y alimento para quienes más lo necesitan.";

function HeroPreview({ form, imageUrl }) {
  const isCampaign = form.active;
  const background = getHeroBackgroundCss(form.background);
  const kicker = isCampaign && form.kicker ? form.kicker : DEFAULT_HERO_KICKER;
  const headline =
    isCampaign && form.headline ? form.headline : DEFAULT_HERO_HEADLINE;
  const body = isCampaign && form.body ? form.body : DEFAULT_HERO_BODY;
  const image = isCampaign && imageUrl ? imageUrl : heroPhoto;

  return (
    <div className="admin-hero-preview">
      <span className="admin-hero-preview__label">
        Vista previa {isCampaign ? "· campaña activa" : "· portada normal"}
      </span>
      <div className="hero-preview" style={{ background }}>
        <span className="hero-preview__kicker">{kicker}</span>
        <h4 className="hero-preview__headline">{headline}</h4>
        <p className="hero-preview__body">{body}</p>
        <img className="hero-preview__image" src={image} alt="" />
      </div>
    </div>
  );
}

function HeroForm({ initial, onSubmit, saving }) {
  const [form, setForm] = useState(EMPTY_HERO_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    if (initial) {
      setForm({
        active: initial.active ?? false,
        kicker: initial.kicker ?? "",
        headline: initial.headline ?? "",
        body: initial.body ?? "",
        background: initial.background ?? DEFAULT_HERO_BACKGROUND,
      });
    }
    setImageFile(null);
  }, [initial]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, imageFile });
  }

  return (
    <div className="admin-hero-editor">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>Portada del sitio (hero)</h3>
        <p className="admin-form__hint">
          Usá esto para publicar una campaña temporal (ej. un festival) en la
          portada principal. Mientras esté desactivado, se muestra la portada
          normal del sitio.
        </p>

        <label className="admin-form__field admin-form__field--checkbox">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => update("active", e.target.checked)}
          />
          <span>Mostrar esta campaña en la portada</span>
        </label>

        <label className="admin-form__field">
          <span>Texto pequeño de arriba (ej. "Centro Comunitario MINKA")</span>
          <input
            type="text"
            value={form.kicker}
            onChange={(e) => update("kicker", e.target.value)}
            placeholder="Ej: Festival de primavera"
          />
        </label>

        <label className="admin-form__field">
          <span>Título grande</span>
          <input
            type="text"
            value={form.headline}
            onChange={(e) => update("headline", e.target.value)}
            placeholder='Ej: "Transformar la realidad desde el barrio"'
          />
        </label>

        <label className="admin-form__field">
          <span>Texto de abajo</span>
          <textarea
            rows={3}
            value={form.body}
            onChange={(e) => update("body", e.target.value)}
            placeholder="Descripción corta que acompaña al título"
          />
        </label>

        <label className="admin-form__field">
          <span>Color de fondo</span>
          <div className="admin-form__color">
            <input
              type="color"
              value={form.background}
              onChange={(e) => update("background", e.target.value)}
            />
            <input
              type="text"
              value={form.background}
              onChange={(e) => update("background", e.target.value)}
              placeholder={DEFAULT_HERO_BACKGROUND}
            />
          </div>
        </label>

        <label className="admin-form__field">
          <span>Imagen de fondo (opcional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="admin-form__actions">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar portada"}
          </button>
        </div>
      </form>

      <HeroPreview
        form={form}
        imageUrl={imagePreviewUrl || initial?.image_url}
      />
    </div>
  );
}

function PostForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    setForm(initial ?? EMPTY_FORM);
    setImageFile(null);
    setPdfFile(null);
  }, [initial]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, imageFile, pdfFile });
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>{initial ? "Editar blog" : "Nuevo blog"}</h3>

      <label className="admin-form__field">
        <span>Título</span>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Ej: 3 ferias populares en septiembre"
        />
      </label>

      <label className="admin-form__field">
        <span>Resumen corto (se ve en la tarjeta)</span>
        <textarea
          required
          rows={2}
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          placeholder="1 o 2 líneas que resuman la novedad"
        />
      </label>

      <label className="admin-form__field">
        <span>Texto completo (se ve en la página del blog)</span>
        <RichTextEditor
          key={initial?.id ?? "new"}
          value={initial?.body ?? ""}
          onChange={(html) => update("body", html)}
          placeholder="Contá la novedad. Usá negrita y viñetas para destacar lo importante."
        />
      </label>

      <label className="admin-form__field">
        <span>{initial ? "Cambiar foto (opcional)" : "Foto de portada"}</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <label className="admin-form__field">
        <span>
          PDF adjunto (opcional — ej. el informe trimestral completo)
        </span>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
        />
        <small>
          Si cargás un PDF, en la página del blog va a aparecer un botón
          para descargarlo.
        </small>
      </label>

      <div className="admin-form__actions">
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? "Guardando..." : initial ? "Guardar cambios" : "Publicar blog"}
        </button>
        {initial && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

function Dashboard() {
  const clerk = useClerk();
  const supabase = useSupabase();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [heroCampaign, setHeroCampaign] = useState(null);
  const [savingHero, setSavingHero] = useState(false);

  useEffect(() => {
    refreshPosts();
    refreshHero();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshHero() {
    try {
      setHeroCampaign((await getHeroCampaign(supabase)) ?? EMPTY_HERO_FORM);
    } catch (err) {
      console.error(err);
      setHeroCampaign(EMPTY_HERO_FORM);
    }
  }

  async function handleHeroSubmit(values) {
    setSavingHero(true);
    try {
      await saveHeroCampaign(supabase, values);
      await refreshHero();
    } catch (err) {
      console.error(err);
      alert(
        "Ocurrió un error al guardar la portada: " +
          [err.message, err.hint, err.details].filter(Boolean).join("\n")
      );
    } finally {
      setSavingHero(false);
    }
  }

  async function refreshPosts() {
    setLoadingPosts(true);
    try {
      setPosts(await getPosts(supabase));
    } finally {
      setLoadingPosts(false);
    }
  }

  async function handleSubmit(values) {
    setSaving(true);
    try {
      if (editingPost) {
        await updatePost(supabase, editingPost.id, values);
      } else {
        await createPost(supabase, values);
      }
      setEditingPost(null);
      await refreshPosts();
    } catch (err) {
      console.error(err);
      alert(
        "Ocurrió un error al guardar: " +
          [err.message, err.hint, err.details].filter(Boolean).join("\n")
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(post) {
    if (!window.confirm(`¿Eliminar el blog "${post.title}"? No se puede deshacer.`)) {
      return;
    }
    try {
      await deletePost(supabase, post.id, {
        imageUrl: post.image_url,
        pdfUrl: post.pdf_url,
      });
      await refreshPosts();
    } catch (err) {
      console.error(err);
      alert(
        "Ocurrió un error al eliminar: " +
          [err.message, err.hint, err.details].filter(Boolean).join("\n")
      );
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <img src={logo} alt="MINKA" className="admin-auth__logo" />
        <div className="admin-dashboard__header-actions">
          <Link to="/" className="admin-auth__back">
            Ver el sitio
          </Link>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => clerk.signOut()}
          >
            <FaSignOutAlt /> Salir
          </button>
        </div>
      </header>

      <HeroForm
        initial={heroCampaign}
        onSubmit={handleHeroSubmit}
        saving={savingHero}
      />

      <div className="admin-dashboard__grid">
        <PostForm
          initial={editingPost}
          onSubmit={handleSubmit}
          onCancel={() => setEditingPost(null)}
          saving={saving}
        />

        <div className="admin-list">
          <h3>Blogs publicados</h3>
          {loadingPosts && <p>Cargando...</p>}
          {!loadingPosts && posts.length === 0 && (
            <p>Todavía no publicaste ningún blog.</p>
          )}
          {posts.map((post) => (
            <div className="admin-list__item" key={post.id}>
              {post.image_url && <img src={post.image_url} alt="" />}
              <div className="admin-list__item-body">
                <strong>
                  {post.title} {post.pdf_url && <FaFilePdf title="Tiene PDF" />}
                </strong>
                <span>{formatPostDate(post.created_at)}</span>
              </div>
              <div className="admin-list__item-actions">
                <button
                  type="button"
                  aria-label="Editar"
                  onClick={() => setEditingPost(post)}
                >
                  <FaEdit />
                </button>
                <button
                  type="button"
                  aria-label="Eliminar"
                  onClick={() => handleDelete(post)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Admin() {
  return (
    <>
      <SignedOut>
        <div className="admin-auth">
          <img
            src={logo}
            alt="MINKA Centro Comunitario"
            className="admin-auth__logo"
          />
          <h1 className="section-title">Panel de administración</h1>
          <p>Iniciá sesión con la cuenta de MINKA para gestionar los blogs.</p>
          <SignIn routing="hash" />
          <Link to="/" className="admin-auth__back">
            Volver al sitio
          </Link>
        </div>
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}

export default Admin;
