import { useNavigate } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz.jsx";

export default function WelcomeScreen() {
  const { start, total } = useQuiz();
  const navigate = useNavigate();

  function handleStart() {
    start();
    navigate("/quiz");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
        Anthropic · Claude Code
      </p>
      <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl">
        Quiz do <span className="text-accent">Claude Code</span>
      </h1>
      <p className="mb-10 max-w-md text-base text-white/70 sm:text-lg">
        Teste seus conhecimentos sobre o Claude Code em {total} perguntas — de
        conceitos de negócio a features avançadas.
      </p>
      <button
        onClick={handleStart}
        className="rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-ink transition hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/50"
      >
        Iniciar Quiz
      </button>
    </main>
  );
}
