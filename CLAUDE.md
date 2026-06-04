# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado atual

A v1.0 está implementada: frontend React/Vite nesta pasta `quiz/` e backend Express/Prisma na pasta irmã `../quiz-api/`. O `prd.md` continua sendo a fonte de verdade para escopo, perguntas do quiz, modelo de dados, endpoints e critérios de aceite — consulte-o antes de alterar comportamento.

## Visão geral do produto

Quiz web sobre o Claude Code: 10 perguntas de múltipla escolha (4 alternativas), divididas em 2 níveis de 5 perguntas cada — Iniciante (negócio) e Avançado (técnico), sempre apresentadas nessa ordem. Ao final exibe score total, score por nível e gabarito com explicações. O resultado é persistido no backend de forma anônima.

## Arquitetura planejada (do PRD)

A aplicação é dividida em dois projetos separados:

- **Frontend** (`quiz/`): React 18 + Vite, Tailwind CSS, React Router v6. Estado do quiz centralizado no hook `useQuiz.js`; chamadas HTTP isoladas em `services/api.js`.
- **Backend** (`quiz-api/`): Node.js + Express, REST simples. Prisma como ORM, SQLite em dev e PostgreSQL em produção.

### Decisões de arquitetura que cruzam múltiplos arquivos

- **Perguntas vivem em `src/data/questions.json`** (RNF-04) — alternativas, gabarito e explicações ficam todos nesse arquivo para facilitar manutenção. O conteúdo canônico das 10 perguntas está na seção 4 do `prd.md`. Componentes e o hook consomem esse JSON; não hardcode perguntas em componentes.
- **Sessão anônima por UUID gerado no client** (RNF-05): não há autenticação. O `sessionId` é um UUID criado no frontend e enviado no POST. Ele liga o resultado salvo ao usuário sem identificá-lo.
- **Persistência não-bloqueante** (RF-09 / AC-05): a falha no `POST /api/results` deve apenas mostrar aviso visual; o usuário nunca é impedido de ver o resultado. Trate o save como best-effort.
- **Ordem fixa das perguntas** (AC-01): nível 1 (Q1–Q5) antes do nível 2 (Q6–Q10). O score é separado por nível (`level1Score`, `level2Score`, 0–5 cada) além do `totalScore`.

### Modelo de dados (Prisma)

```prisma
model QuizResult {
  id          String   @id @default(uuid())
  sessionId   String   // UUID anônimo do client
  totalScore  Int
  level1Score Int      // acertos nível iniciante (0-5)
  level2Score Int      // acertos nível avançado (0-5)
  completedAt DateTime @default(now())
}
```

### API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/results` | Salva resultado da sessão (`sessionId`, `totalScore`, `level1Score`, `level2Score`) |
| `GET`  | `/api/results/:sessionId` | Recupera resultado de uma sessão |

## Identidade visual (não negociável no design)

- Fundo escuro `#0a0a0a`, texto branco, destaque laranja/coral `#E87040` (marca Anthropic/Claude).
- Tipografia Inter (Google Fonts).
- No gabarito: alternativa correta em verde, alternativa errada selecionada em vermelho.
- Responsivo de 375px (mobile) a 1280px+ (desktop); contraste WCAG AA e navegação por teclado (RNF-03).

## Comandos

O frontend usa o proxy do Vite (`/api` → `http://localhost:3001`), então **suba o backend antes** para o fluxo funcionar ponta a ponta.

```bash
# Backend (pasta ../quiz-api/) — porta 3001
npm install
npx prisma migrate dev      # cria/atualiza o SQLite (prisma/dev.db)
npm run dev                 # Express com nodemon (ou: npm start)

# Frontend (pasta quiz/) — porta 5173
npm install
npm run dev                 # Vite dev server
npm run build               # build de produção (gera dist/)
```

Health check do backend: `GET http://localhost:3001/health`.

## Critérios de aceite a verificar (seção 10 do PRD)

Exatamente 10 perguntas na ordem correta · 4 alternativas por pergunta · score e gabarito corretos na tela final · resultado salvo via POST · falha no POST não bloqueia · funciona em Chrome/Firefox/Safari mobile e desktop · Lighthouse Performance ≥ 80.
