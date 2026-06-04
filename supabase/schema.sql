-- Estrutura da persistência do quiz no Supabase (PostgreSQL).
-- Espelha o modelo do PRD (seção "Modelo de dados") em convenção snake_case.
--
-- Como aplicar: Painel Supabase -> SQL Editor -> cole e rode este arquivo.

-- 1) Tabela de resultados (anônimos, ligados por session_id gerado no client).
create table if not exists public.quiz_results (
  id           uuid        primary key default gen_random_uuid(),
  session_id   text        not null,
  total_score  integer     not null check (total_score between 0 and 10),
  level1_score integer     not null check (level1_score between 0 and 5),
  level2_score integer     not null check (level2_score between 0 and 5),
  completed_at timestamptz not null default now()
);

-- Índice para consultas por sessão (getResult).
create index if not exists quiz_results_session_id_idx
  on public.quiz_results (session_id);

-- 2) Row Level Security: obrigatório, pois o app usa a chave publishable no client.
alter table public.quiz_results enable row level security;

-- 3) GRANT: o role `anon` (usado pela chave publishable) precisa de privilégio
--    de INSERT na tabela. Criar a tabela por conexão direta não concede isso
--    automaticamente, então fazemos explicitamente.
grant insert on public.quiz_results to anon;

-- 4) Policy de INSERT: permite gravar resultados anonimamente.
--    O quiz é público e os dados não têm PII, então o INSERT anônimo é seguro.
drop policy if exists "anon_insert_results" on public.quiz_results;
create policy "anon_insert_results"
  on public.quiz_results
  for insert
  to anon
  with check (true);

-- 5) SELECT permanece BLOQUEADO por padrão (sem grant nem policy = leitura negada).
--    Isso evita que qualquer um liste todos os resultados pela chave pública.
--    Se você precisar usar getResult() no frontend, descomente as duas linhas
--    abaixo, ciente de que isso expõe TODOS os resultados (anônimos, sem PII):
--
-- grant select on public.quiz_results to anon;
-- create policy "anon_select_results"
--   on public.quiz_results
--   for select
--   to anon
--   using (true);
