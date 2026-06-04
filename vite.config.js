import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// A persistência usa o Supabase direto do client (ver src/services/supabase.js),
// então não há mais proxy para backend local.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.{js,jsx}"],
  },
});
