import { Navigate, Route, Routes } from "react-router-dom";
import { useQuiz } from "./hooks/useQuiz.jsx";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";

export default function App() {
  const { phase } = useQuiz();

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-8 sm:py-12">
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route
          path="/quiz"
          element={phase === "welcome" ? <Navigate to="/" replace /> : <QuizScreen />}
        />
        <Route
          path="/result"
          element={phase !== "result" ? <Navigate to="/" replace /> : <ResultScreen />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
