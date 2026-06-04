import { createClient } from "@supabase/supabase-js";

// Client único do Supabase para o app inteiro. Usa a chave publishable/anon,
// que é pública por design — o acesso real é controlado por RLS no banco.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Persistência é best-effort (RF-09 / AC-05): se as credenciais faltarem,
// não derrubamos o app — apenas deixamos o client nulo e a camada de API trata.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      })
    : null;
