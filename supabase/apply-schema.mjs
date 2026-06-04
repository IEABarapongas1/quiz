// Aplica supabase/schema.sql no banco Postgres do Supabase.
//
// Uso (a senha NUNCA fica no repo — passe via variável de ambiente).
// Use a connection string do POOLER (Session mode), que funciona via IPv4:
//   Painel Supabase -> Connect -> Session pooler.
//   Para este projeto (região sa-east-1):
//
//   $env:DATABASE_URL="postgresql://postgres.<ref>:SENHA@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
//   node supabase/apply-schema.mjs
//
// A senha precisa estar URL-encoded (ex.: '#' vira '%23').

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Defina DATABASE_URL com a connection string do Postgres do Supabase.");
  process.exit(1);
}

const sql = readFileSync(join(__dirname, "schema.sql"), "utf8");

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log("Schema aplicado com sucesso.");
} catch (err) {
  console.error("Falha ao aplicar o schema:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
