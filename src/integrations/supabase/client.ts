import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Si faltan variables de entorno, se usan valores demo para que la UI siempre arranque (sin pantalla en blanco).
const FALLBACK_URL = "https://demo.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

const url = typeof envUrl === "string" && envUrl.trim() !== "" ? envUrl.trim() : FALLBACK_URL;
const key = typeof envKey === "string" && envKey.trim() !== "" ? envKey.trim() : FALLBACK_KEY;

export const supabase = createClient<Database>(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
