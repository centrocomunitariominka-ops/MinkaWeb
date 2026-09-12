import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Si todavía no se configuró Supabase, dejamos el cliente en null en vez de
// romper la carga de la página pública: getPosts/getPost fallan de forma
// controlada y la home muestra el estado vacío en lugar de crashear.
export const supabase = url && publishableKey ? createClient(url, publishableKey) : null;
