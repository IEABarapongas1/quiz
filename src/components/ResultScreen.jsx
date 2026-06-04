import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz.jsx";
import { saveResult } from "../services/api.js";
import AnswerExplanation from "./AnswerExplanation.jsx";
import { LETTERS } from "../data/constants.js";

export default function ResultScreen() {
  const { questions, answers, scores, sessionId, restart } = useQuiz();
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState("saving"); // saving | saved | error
  const savedRef = useRef(false);

  useEffect(() => {
    if (savedRef.current) return; // evita save duplicado (StrictMode)
    savedRef.current = true;
    // Como o estado agora sobrevive a refresh (sessionStorage), evitamos
    // reenviar o POST se esta sessão já foi persistida com sucesso.
    const saveKey = `quiz-saved-${sessionId}`;
    if (sessionStorage.getItem(saveKey)) {
      setSaveStatus("saved");
      return;
    }
    saveResult({ sessionId, ...scores }).then((res) => {
      if (res.ok) sessionStorage.setItem(saveKey, "1");
      setSaveStatus(res.ok ? "saved" : "error");
    });
  }, [sessionId, scores]);

  function handleRestart() {
    restart();
    navigate("/");
  }

  return (
    <main className="flex flex-1 flex-col">
      <header className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
          Resultado
        </p>
        <p className="text-5xl font-extrabold">
          {scores.totalScore}
          <span className="text-white/40"> / {questions.length}</span>
        </p>
        <p className="mt-2 text-white/70">
          {scores.totalScore} de {questions.length} respostas corretas
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <ScoreChip label="Iniciante" value={scores.level1Score} max={5} />
          <ScoreChip label="Avançado" value={scores.level2Score} max={5} />
        </div>
      </header>

      {saveStatus === "error" && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-wrong/40 bg-wrong/10 p-3 text-center text-sm text-wrong"
        >
          Não foi possível salvar seu resultado, mas você pode revisar o gabarito
          normalmente.
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold">Gabarito</h2>
      <ol className="flex flex-col gap-5">
        {questions.map((q, i) => {
          const userAnswer = answers[i];
          const correct = userAnswer === q.correctIndex;
          return (
            <li
              key={q.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="font-medium">
                  {i + 1}. {q.question}
                </h3>
                <span
                  className={`flex-none rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    correct
                      ? "bg-correct/20 text-correct"
                      : "bg-wrong/20 text-wrong"
                  }`}
                >
                  {correct ? "Acertou" : "Errou"}
                </span>
              </div>

              <p className="mb-1 text-sm text-correct">
                ✓ Correta: {LETTERS[q.correctIndex]}) {q.options[q.correctIndex]}
              </p>
              {!correct && userAnswer !== null && (
                <p className="mb-3 text-sm text-wrong">
                  ✗ Sua resposta: {LETTERS[userAnswer]}) {q.options[userAnswer]}
                </p>
              )}
              <div className="mt-3">
                <AnswerExplanation explanation={q.explanation} />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 flex justify-center">
        <button
          onClick={handleRestart}
          className="rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-ink transition hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/50"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}

function ScoreChip({ label, value, max }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center">
      <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
      <p className="text-lg font-bold">
        {value}
        <span className="text-white/40"> / {max}</span>
      </p>
    </div>
  );
}
