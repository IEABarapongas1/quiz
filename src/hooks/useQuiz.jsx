import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import questions from "../data/questions.json";

const QuizContext = createContext(null);

const TOTAL = questions.length;
const STORAGE_KEY = "quiz-state";

// Calcula os scores a partir das respostas selecionadas.
// `list` é injetável para facilitar testes; por padrão usa as perguntas reais.
export function computeScores(answers, list = questions) {
  let totalScore = 0;
  let level1Score = 0;
  let level2Score = 0;
  list.forEach((q, i) => {
    if (answers[i] === q.correctIndex) {
      totalScore += 1;
      if (q.level === 1) level1Score += 1;
      else level2Score += 1;
    }
  });
  return { totalScore, level1Score, level2Score };
}

// Recupera o estado persistido (sobrevive a refresh / abertura direta de rota).
// Retorna null se não houver estado válido — qualquer corrupção cai no padrão.
function loadPersistedState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !["welcome", "quiz", "result"].includes(parsed.phase) ||
      !Array.isArray(parsed.answers) ||
      parsed.answers.length !== TOTAL
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function QuizProvider({ children }) {
  const persisted = loadPersistedState();
  const [phase, setPhase] = useState(persisted?.phase ?? "welcome"); // welcome | quiz | result
  const [currentIndex, setCurrentIndex] = useState(persisted?.currentIndex ?? 0);
  const [answers, setAnswers] = useState(
    () => persisted?.answers ?? Array(TOTAL).fill(null)
  );
  const [sessionId, setSessionId] = useState(persisted?.sessionId ?? null);

  // Persiste o estado a cada mudança, para suportar refresh e links diretos.
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ phase, currentIndex, answers, sessionId })
      );
    } catch {
      // Storage indisponível (modo privado/quota): degrada para estado em memória.
    }
  }, [phase, currentIndex, answers, sessionId]);

  const start = useCallback(() => {
    setAnswers(Array(TOTAL).fill(null));
    setCurrentIndex(0);
    setSessionId(uuidv4());
    setPhase("quiz");
  }, []);

  // Registra a resposta da questão atual (feedback imediato acontece na UI).
  const selectAnswer = useCallback(
    (optionIndex) => {
      setAnswers((prev) => {
        if (prev[currentIndex] !== null) return prev; // já respondida — bloqueia troca
        const next = [...prev];
        next[currentIndex] = optionIndex;
        return next;
      });
    },
    [currentIndex]
  );

  // Avança para a próxima questão ou conclui o quiz.
  const next = useCallback(() => {
    if (currentIndex < TOTAL - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase("result");
    }
  }, [currentIndex]);

  const restart = useCallback(() => {
    try {
      if (sessionId) sessionStorage.removeItem(`quiz-saved-${sessionId}`);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignora indisponibilidade do storage
    }
    setPhase("welcome");
    setCurrentIndex(0);
    setAnswers(Array(TOTAL).fill(null));
    setSessionId(null);
  }, [sessionId]);

  const scores = useMemo(() => computeScores(answers), [answers]);

  const value = useMemo(
    () => ({
      phase,
      questions,
      total: TOTAL,
      currentIndex,
      currentQuestion: questions[currentIndex],
      selectedAnswer: answers[currentIndex],
      answers,
      sessionId,
      scores,
      start,
      selectAnswer,
      next,
      restart,
    }),
    [
      phase,
      currentIndex,
      answers,
      sessionId,
      scores,
      start,
      selectAnswer,
      next,
      restart,
    ]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz precisa estar dentro de <QuizProvider>");
  return ctx;
}
