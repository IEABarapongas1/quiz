import { describe, expect, it } from "vitest";
import questions from "../data/questions.json";
import { computeScores } from "./useQuiz.jsx";

describe("computeScores", () => {
  it("zera tudo quando nada foi respondido", () => {
    const answers = Array(questions.length).fill(null);
    expect(computeScores(answers)).toEqual({
      totalScore: 0,
      level1Score: 0,
      level2Score: 0,
    });
  });

  it("pontua 10/5/5 quando todas as respostas estão corretas", () => {
    const answers = questions.map((q) => q.correctIndex);
    expect(computeScores(answers)).toEqual({
      totalScore: 10,
      level1Score: 5,
      level2Score: 5,
    });
  });

  it("separa o score por nível (apenas nível 1 correto)", () => {
    const answers = questions.map((q) =>
      q.level === 1 ? q.correctIndex : (q.correctIndex + 1) % 4
    );
    expect(computeScores(answers)).toEqual({
      totalScore: 5,
      level1Score: 5,
      level2Score: 0,
    });
  });

  it("não conta respostas erradas", () => {
    const answers = questions.map((q) => (q.correctIndex + 1) % 4);
    expect(computeScores(answers)).toEqual({
      totalScore: 0,
      level1Score: 0,
      level2Score: 0,
    });
  });
});
