import { memo } from "react";
import AnswerExplanation from "./AnswerExplanation.jsx";
import { LETTERS } from "../data/constants.js";

// Card de uma pergunta com feedback imediato.
// Após responder (selectedAnswer !== null): destaca a correta em verde,
// a errada selecionada em vermelho, desabilita as opções e revela a explicação.
function QuizQuestion({ question, selectedAnswer, onSelect }) {
  const answered = selectedAnswer !== null && selectedAnswer !== undefined;
  const levelLabel = question.level === 1 ? "Iniciante" : "Avançado";

  function optionClasses(index) {
    const base =
      "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";
    if (!answered) {
      return `${base} border-white/15 bg-white/5 hover:border-accent/60 hover:bg-white/10`;
    }
    if (index === question.correctIndex) {
      return `${base} border-correct bg-correct/15`;
    }
    if (index === selectedAnswer) {
      return `${base} border-wrong bg-wrong/15`;
    }
    return `${base} border-white/10 bg-white/5 opacity-60`;
  }

  return (
    <section>
      <span className="mb-3 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
        {levelLabel}
      </span>
      <h2 className="mb-6 text-xl font-semibold sm:text-2xl">{question.question}</h2>

      <div className="flex flex-col gap-3">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctIndex;
          const isWrongSelected = index === selectedAnswer && !isCorrect;
          // Indicador textual além da cor (WCAG 1.4.1 — não depender só de cor).
          let statusLabel = null;
          if (answered && isCorrect) statusLabel = "Resposta correta";
          else if (answered && isWrongSelected) statusLabel = "Sua resposta, incorreta";

          return (
            <button
              key={index}
              type="button"
              disabled={answered}
              onClick={() => onSelect(index)}
              aria-pressed={selectedAnswer === index}
              aria-label={statusLabel ? `${option}. ${statusLabel}` : undefined}
              className={optionClasses(index)}
            >
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-white/30 text-sm font-semibold">
                {LETTERS[index]}
              </span>
              <span className="flex-1 text-base leading-snug">{option}</span>
              {answered && isCorrect && (
                <span aria-hidden className="mt-0.5 flex-none font-bold text-correct">
                  ✓
                </span>
              )}
              {answered && isWrongSelected && (
                <span aria-hidden className="mt-0.5 flex-none font-bold text-wrong">
                  ✗
                </span>
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-6">
          <AnswerExplanation explanation={question.explanation} />
        </div>
      )}
    </section>
  );
}

export default memo(QuizQuestion);
