import { useNavigate } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz.jsx";
import ProgressBar from "./ProgressBar.jsx";
import QuizQuestion from "./QuizQuestion.jsx";

export default function QuizScreen() {
  const {
    currentIndex,
    currentQuestion,
    selectedAnswer,
    total,
    selectAnswer,
    next,
  } = useQuiz();
  const navigate = useNavigate();

  const answered = selectedAnswer !== null;
  const isLast = currentIndex === total - 1;

  function handleNext() {
    if (isLast) {
      next(); // muda a fase para "result"
      navigate("/result");
    } else {
      next();
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <ProgressBar current={currentIndex + 1} total={total} />

      <QuizQuestion
        key={currentQuestion.id}
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onSelect={selectAnswer}
      />

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!answered}
          className="rounded-xl bg-accent px-6 py-3 font-semibold text-ink transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/50"
        >
          {isLast ? "Ver resultado" : "Próxima"}
        </button>
      </div>
    </main>
  );
}
