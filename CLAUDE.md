# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado atual

A v1.0 está implementada como **app frontend-only** (React/Vite nesta pasta `quiz/`), com persistência direta no **Supabase**. O backend Express/Prisma em `../quiz-api/` foi **aposentado** para a persistência e não é mais usado pelo app (permanece apenas como referência histórica). O `prd.md` continua sendo a fonte de verdade para escopo, perguntas do quiz e critérios de aceite — consulte-o antes de alterar comportamento, mas note que a camada de dados migrou para o Supabase (ver abaixo).

## Visão geral do produto

Quiz web sobre o Claude Code: 10 perguntas de múltipla escolha (4 alternativas), divididas em 2 níveis de 5 perguntas cada — Iniciante (negócio) e Avançado (técnico), sempre apresentadas nessa ordem. Ao final exibe score total, score por nível e gabarito com explicações. O resultado é persistido no Supabase de forma anônima.

## Arquitetura

App **frontend-only** que grava direto no Supabase (não há backend próprio):

- **Frontend** (`quiz/`): React 18 + Vite, Tailwind CSS, React Router v6. Estado do quiz centralizado no hook `useQuiz.jsx`; acesso a dados isolado em `services/api.js`, que usa o client de `services/supabase.js`.
- **Persistência** (Supabase / PostgreSQL): o frontend grava na tabela `quiz_results` usando a **chave publishable (anon)** direto do client. A segurança vem das policies de **RLS** no banco — ver `supabase/schema.sql`. Sem autenticação; sessões anônimas por UUID.

### Decisões de arquitetura que cruzam múltiplos arquivos

- **Perguntas vivem em `src/data/questions.json`** (RNF-04) — alternativas, gabarito e explicações ficam todos nesse arquivo para facilitar manutenção. O conteúdo canônico das 10 perguntas está na seção 4 do `prd.md`. Componentes e o hook consomem esse JSON; não hardcode perguntas em componentes.
- **Sessão anônima por UUID gerado no client** (RNF-05): não há autenticação. O `sessionId` é um UUID criado no frontend e gravado na coluna `session_id`. Ele liga o resultado salvo ao usuário sem identificá-lo.
- **Persistência não-bloqueante** (RF-09 / AC-05): a falha no insert do Supabase deve apenas mostrar aviso visual; o usuário nunca é impedido de ver o resultado. `saveResult` em `services/api.js` nunca lança — retorna `{ ok, error? }` e o insert não pede o registro de volta (`.select()`), o que mantém o SELECT bloqueado por RLS.
- **Ordem fixa das perguntas** (AC-01): nível 1 (Q1–Q5) antes do nível 2 (Q6–Q10). O score é separado por nível (`level1Score`, `level2Score`, 0–5 cada) além do `totalScore`.

### Modelo de dados (Supabase / PostgreSQL)

Tabela `public.quiz_results` (definição canônica em `supabase/schema.sql`), em convenção snake_case:

```sql
create table public.quiz_results (
  id           uuid        primary key default gen_random_uuid(),
  session_id   text        not null,   -- UUID anônimo do client
  total_score  integer     not null,   -- 0-10
  level1_score integer     not null,   -- acertos nível iniciante (0-5)
  level2_score integer     not null,   -- acertos nível avançado (0-5)
  completed_at timestamptz not null default now()
);
```

O frontend envia camelCase (`sessionId`, `totalScore`, ...) e `services/api.js` mapeia para as colunas snake_case no insert.

### Acesso a dados (Supabase)

Não há API REST própria. O acesso é via `supabase-js` em `services/api.js`:

- `saveResult({ sessionId, totalScore, level1Score, level2Score })` → `insert` na tabela `quiz_results`. Habilitado pela policy de RLS `anon_insert_results` + `grant insert ... to anon`.
- `getResult(sessionId)` → `select` por `session_id`. **Bloqueado por padrão** (sem grant/policy de SELECT, por segurança da chave pública); para habilitar, descomente as linhas indicadas em `supabase/schema.sql`.

Para (re)aplicar o schema: `supabase/schema.sql` no SQL Editor do Supabase, ou `node supabase/apply-schema.mjs` com `DATABASE_URL` apontando para o **Session pooler** (a conexão direta não resolve via IPv4).

## Identidade visual (não negociável no design)

- Fundo escuro `#0a0a0a`, texto branco, destaque laranja/coral `#E87040` (marca Anthropic/Claude).
- Tipografia Inter (Google Fonts).
- No gabarito: alternativa correta em verde, alternativa errada selecionada em vermelho.
- Responsivo de 375px (mobile) a 1280px+ (desktop); contraste WCAG AA e navegação por teclado (RNF-03).

## Comandos

App frontend-only — não precisa subir backend. As credenciais do Supabase ficam em `.env` (copie de `.env.example`); sem elas, o quiz funciona mas o save degrada para erro best-effort.

```bash
# Frontend (pasta quiz/) — porta 5173 (ou a próxima livre)
npm install
npm run dev                 # Vite dev server
npm run build               # build de produção (gera dist/)
npm test                    # Vitest
```

Variáveis de ambiente (em `.env`, nunca commitadas):

```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<chave publishable/anon>
```

> O Vite só lê o `.env` no startup — se editar o `.env`, reinicie o `npm run dev`.

## Critérios de aceite a verificar (seção 10 do PRD)

Exatamente 10 perguntas na ordem correta · 4 alternativas por pergunta · score e gabarito corretos na tela final · resultado salvo no Supabase (insert em `quiz_results`) · falha no save não bloqueia · funciona em Chrome/Firefox/Safari mobile e desktop · Lighthouse Performance ≥ 80.
