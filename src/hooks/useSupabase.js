import { useMemo } from "react";
import { useSession } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Cliente de Supabase que adjunta el token de sesión de Clerk en cada
// pedido, para que las políticas de RLS puedan validar quién es el admin.
export function useSupabase() {
  const { session } = useSession();

  return useMemo(() => {
    return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      async accessToken() {
        return (await session?.getToken()) ?? null;
      },
    });
  }, [session]);
}
