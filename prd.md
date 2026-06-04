# PRD — Claude Code Quiz Web

## 1. Visão geral do produto

**Nome:** Claude Code Quiz  
**Objetivo:** Aplicação web interativa que testa o conhecimento dos usuários sobre o Claude Code por meio de perguntas de múltipla escolha, cobrindo desde conceitos de negócio (nível iniciante) até features avançadas (nível avançado).  
**Público-alvo:** Executivos e gestores, desenvolvedores experientes e times mistos (negócio + tech).  
**Motivação:** Acelerar a adoção do Claude Code em organizações ao criar um ponto de entrada educativo, gamificado e de baixo atrito.

---

## 2. Objetivos de negócio

| Objetivo | Métrica de sucesso |
|---|---|
| Educar o mercado sobre Claude Code | ≥ 70% dos usuários completam o quiz |
| Diferenciar nível de conhecimento por perfil | Taxa de acerto por nível registrada no Supabase |
| Gerar engajamento e compartilhamento | Usuário recebe gabarito completo e pode revisitar |
| Base para trilha de aprendizado futura | PRD prevê extensão para módulos adicionais |

---

## 3. Escopo da versão 1.0

### 3.1 Funcionalidades incluídas

- Quiz com **10 perguntas de múltipla escolha** (4 alternativas cada)
- **2 níveis de dificuldade**: Iniciante (negócio) e Avançado (técnico)
- 5 perguntas por nível, apresentadas em sequência (iniciante → avançado)
- Indicador visual de progresso durante o quiz
- Tela de resultado ao final com:
  - Pontuação total (ex: 8/10)
  - Gabarito completo com a resposta correta e uma explicação curta por questão
- **Persistência de resultados no Supabase** (score, acertos por nível, timestamp)
- Identidade visual alinhada à marca Anthropic/Claude (cores: preto, branco, laranja/coral)

### 3.2 Fora do escopo (v1.0)

- Autenticação de usuários
- Ranking/leaderboard público
- Modo multiplayer
- Geração dinâmica de perguntas via IA
- Internacionalização (i18n)

---

## 4. Perguntas do quiz

### Nível 1 — Iniciante (Negócio)

**Q1.** O que é o Claude Code?
- A) Um editor de texto criado pela Anthropic
- B) Uma ferramenta de linha de comando que permite delegar tarefas de codificação ao Claude diretamente do terminal ✅
- C) Um plugin do VS Code para autocompletar código
- D) Uma linguagem de programação proprietária da Anthropic

*Explicação: Claude Code é um CLI (Command Line Interface) que conecta o modelo Claude ao ambiente de desenvolvimento do usuário, permitindo que ele execute tarefas de engenharia de forma autônoma.*

---

**Q2.** Qual é o principal benefício do Claude Code para equipes de negócio?
- A) Substitui completamente a equipe de engenharia
- B) Gera relatórios financeiros automaticamente
- C) Acelera a entrega de software ao automatizar tarefas repetitivas de codificação ✅
- D) Faz deploy de aplicações em qualquer cloud sem configuração

*Explicação: Claude Code aumenta a produtividade dos times de engenharia ao assumir tarefas como refatoração, escrita de testes e geração de código boilerplate, liberando os desenvolvedores para trabalho de maior valor.*

---

**Q3.** Claude Code é um produto de qual empresa?
- A) OpenAI
- B) Google DeepMind
- C) Microsoft
- D) Anthropic ✅

*Explicação: Claude Code é desenvolvido e mantido pela Anthropic, a mesma empresa por trás do modelo de IA Claude.*

---

**Q4.** Em qual ambiente o Claude Code opera primariamente?
- A) Interface web do navegador
- B) Terminal / linha de comando ✅
- C) Aplicativo mobile
- D) Planilhas do Google

*Explicação: Claude Code é uma ferramenta CLI — o usuário interage com ela diretamente no terminal, o que permite integração nativa com o sistema de arquivos, Git e outras ferramentas do desenvolvedor.*

---

**Q5.** Qual das afirmações melhor descreve o modelo de operação do Claude Code?
- A) O usuário digita código e o Claude revisa
- B) O Claude sugere snippets que o usuário copia manualmente
- C) O Claude age como um agente autônomo que lê arquivos, escreve código e executa comandos com supervisão do usuário ✅
- D) O Claude apenas responde perguntas sobre documentação

*Explicação: Claude Code opera em modo agêntico — ele pode ler e escrever arquivos, executar comandos no terminal e iterar sobre sua própria saída, sempre com o desenvolvedor no controle.*

---

### Nível 2 — Avançado (Técnico)

**Q6.** O que são "hooks" no Claude Code?
- A) Atalhos de teclado para abrir o terminal
- B) Scripts de integração com GitHub Actions
- C) Mecanismos que permitem executar código customizado em eventos do ciclo de vida do agente (ex: antes/depois de um tool call) ✅
- D) Aliases de comandos do shell

*Explicação: Hooks permitem que o usuário injete lógica personalizada em pontos específicos da execução do Claude Code, como validar outputs ou disparar notificações após uma ação.*

---

**Q7.** O que é um MCP Server no contexto do Claude Code?
- A) Um servidor de métricas de performance do Claude
- B) Um protocolo que expõe ferramentas e contexto externo para o agente via uma interface padronizada ✅
- C) Um serviço de autenticação da Anthropic
- D) Um tipo de banco de dados vetorial usado pelo Claude

*Explicação: MCP (Model Context Protocol) é um padrão aberto que permite conectar fontes de dados e ferramentas externas (ex: Slack, banco de dados, APIs) ao Claude Code de forma plug-and-play.*

---

**Q8.** Qual flag permite que o Claude Code execute ações sem pedir confirmação ao usuário a cada passo?
- A) `--silent`
- B) `--fast`
- C) `--no-confirm`
- D) `--dangerously-skip-permissions` ✅

*Explicação: A flag `--dangerously-skip-permissions` desabilita os prompts de confirmação, útil em pipelines de CI/CD, mas deve ser usada com cautela pois o Claude terá autonomia total sobre o ambiente.*

---

**Q9.** Como o Claude Code gerencia contexto em projetos grandes que excedem sua janela de contexto?
- A) Ele ignora arquivos antigos automaticamente
- B) Usa um banco de dados externo obrigatório
- C) Trunca o código para caber na janela
- D) Usa arquivos como CLAUDE.md e leitura seletiva de arquivos relevantes para manter o contexto eficiente ✅

*Explicação: O Claude Code lê arquivos CLAUDE.md (documentação do projeto), usa buscas por padrão e carrega apenas os arquivos relevantes para a tarefa atual, otimizando o uso da janela de contexto.*

---

**Q10.** O que é um "slash command" customizado no Claude Code?
- A) Um comando do sistema operacional exposto ao Claude
- B) Um atalho de terminal definido pelo usuário no .bashrc
- C) Um comando definido em arquivos `.md` dentro da pasta `.claude/commands/` que encapsula prompts reutilizáveis ✅
- D) Uma integração com a API REST da Anthropic

*Explicação: Slash commands customizados são arquivos Markdown em `.claude/commands/` que o usuário pode invocar com `/nome-do-comando` para executar workflows pré-definidos, como revisar PRs ou rodar análises de segurança.*

---

## 5. Requisitos funcionais

| ID | Requisito |
|---|---|
| RF-01 | Exibir boas-vindas com título, descrição e botão "Iniciar Quiz" |
| RF-02 | Apresentar perguntas uma a uma com 4 alternativas clicáveis |
| RF-03 | Indicar visualmente a pergunta atual e o total (ex: "3 / 10") |
| RF-04 | Bloquear troca de resposta após seleção (ou permitir até confirmar — definir na implementação) |
| RF-05 | Ao finalizar, exibir score (ex: "7 de 10 corretas") |
| RF-06 | Exibir gabarito completo: cada pergunta com a alternativa certa destacada e uma explicação |
| RF-07 | Botão "Tentar novamente" na tela de resultado |
| RF-08 | Persistir resultado no Supabase: score total, acertos por nível e timestamp |
| RF-09 | Tratar erros de rede (falha no save) com feedback visual não-bloqueante |

## 6. Requisitos não-funcionais

| ID | Requisito |
|---|---|
| RNF-01 | Tempo de carregamento inicial < 2s em conexão 4G |
| RNF-02 | Responsivo: funcionar bem em mobile (375px) e desktop (1280px+) |
| RNF-03 | Acessibilidade: contraste WCAG AA, navegação por teclado |
| RNF-04 | Perguntas definidas em arquivo JSON separado (fácil manutenção) |
| RNF-05 | Sem autenticação na v1.0 — resultado salvo com UUID anônimo gerado no client |

---

## 7. Arquitetura técnica

### 7.1 Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite |
| Estilização | Tailwind CSS |
| Roteamento | React Router v6 |
| Acesso a dados | `@supabase/supabase-js` (client direto, sem backend próprio) |
| Banco de dados | Supabase (PostgreSQL gerenciado) |
| Segurança de dados | Row Level Security (RLS) + chave publishable/anon |

> **Nota de evolução:** a v1.0 inicial previa um backend Express/Prisma com SQLite/PostgreSQL. A persistência foi migrada para o **Supabase**, com o frontend gravando direto no banco via RLS. O backend Express foi aposentado.

### 7.2 Estrutura de pastas (frontend)

```
quiz/
├── public/
├── src/
│   ├── components/
│   │   ├── WelcomeScreen.jsx
│   │   ├── QuizQuestion.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ResultScreen.jsx
│   │   └── AnswerExplanation.jsx
│   ├── data/
│   │   └── questions.json        # perguntas, alternativas, gabarito, explicações
│   ├── hooks/
│   │   └── useQuiz.jsx           # lógica de estado do quiz (Context)
│   ├── services/
│   │   ├── supabase.js           # client do Supabase
│   │   └── api.js                # saveResult / getResult (acesso a dados)
│   ├── components/
│   │   └── ErrorBoundary.jsx     # fallback global de erros
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   ├── schema.sql                # tabela quiz_results + RLS + grants
│   └── apply-schema.mjs          # helper de migração
├── .env                          # credenciais (não versionado)
├── index.html
├── vite.config.js
└── tailwind.config.js
```

### 7.3 Modelo de dados (Supabase / PostgreSQL)

Tabela `public.quiz_results` (definição canônica em `supabase/schema.sql`):

```sql
create table public.quiz_results (
  id           uuid        primary key default gen_random_uuid(),
  session_id   text        not null,   -- UUID anônimo gerado no client
  total_score  integer     not null,   -- 0-10
  level1_score integer     not null,   -- acertos no nível iniciante (0-5)
  level2_score integer     not null,   -- acertos no nível avançado (0-5)
  completed_at timestamptz not null default now()
);
```

RLS habilitado: `grant insert` + policy `anon_insert_results` permitem gravação anônima; SELECT fica bloqueado por padrão (segurança da chave pública).

### 7.4 Acesso a dados (Supabase)

Sem API REST própria — o frontend usa `supabase-js` (`services/api.js`):

- `saveResult({ sessionId, totalScore, level1Score, level2Score })` → `insert` em `quiz_results` (mapeado para colunas snake_case). Best-effort: nunca lança, retorna `{ ok, error? }`.
- `getResult(sessionId)` → `select` por `session_id` (requer habilitar a policy de SELECT em `schema.sql`).

---

## 8. Fluxo do usuário

```
Tela de Boas-vindas
      ↓ [Iniciar Quiz]
Pergunta 1 (Iniciante)
      ↓ [Selecionar resposta]
...
Pergunta 5 (Iniciante)
      ↓
Pergunta 6 (Avançado)
      ↓ [Selecionar resposta]
...
Pergunta 10 (Avançado)
      ↓ [Ver Resultado]
Tela de Resultado
  - Score geral
  - Score por nível
  - Gabarito com explicações
  - [Tentar novamente]
```

---

## 9. Design e identidade visual

- **Paleta:** Fundo escuro (`#0a0a0a`), texto branco, destaque laranja/coral (`#E87040`) — alinhado à marca Anthropic
- **Tipografia:** Inter ou similar (Google Fonts)
- **Alternativa correta:** destacada em verde após revelar gabarito
- **Alternativa errada selecionada:** destacada em vermelho
- **Barra de progresso:** no topo, avança a cada pergunta respondida
- **Animações:** transição suave entre perguntas (fade ou slide)

---

## 10. Critérios de aceite

| # | Critério |
|---|---|
| AC-01 | O quiz exibe exatamente 10 perguntas em sequência correta |
| AC-02 | Cada pergunta tem exatamente 4 alternativas |
| AC-03 | A tela de resultado mostra score correto e gabarito completo |
| AC-04 | O resultado é salvo no Supabase (insert em `quiz_results`) após conclusão |
| AC-05 | Em caso de falha no save, o usuário vê mensagem de aviso mas não é bloqueado |
| AC-06 | O quiz funciona corretamente em Chrome, Firefox e Safari (desktop e mobile) |
| AC-07 | A aplicação passa em Lighthouse Performance ≥ 80 |

---

## 11. Roadmap pós-v1.0

| Fase | Feature |
|---|---|
| v1.1 | Ranking anônimo (top scores) |
| v1.2 | Novos módulos temáticos (ex: Claude API, MCP avançado) |
| v1.3 | Modo desafio: perguntas aleatórias com timer |
| v2.0 | Autenticação, perfis, histórico de tentativas |

---

*Documento gerado em: 2026-06-03*  
*Versão: 1.0*
