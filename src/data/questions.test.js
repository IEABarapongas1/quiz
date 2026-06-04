import { describe, expect, it } from "vitest";
import questions from "./questions.json";

// Protege os critérios de aceite da seção 10 do PRD que vivem nos dados.
describe("questions.json", () => {
  it("tem exatamente 10 perguntas (AC-01)", () => {
    expect(questions).toHaveLength(10);
  });

  it("respeita a ordem dos níveis: Q1–Q5 iniciante, Q6–Q10 avançado (AC-01)", () => {
    questions.slice(0, 5).forEach((q) => expect(q.level).toBe(1));
    questions.slice(5, 10).forEach((q) => expect(q.level).toBe(2));
  });

  it("usa ids únicos", () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada pergunta tem 4 alternativas, gabarito válido e textos preenchidos", () => {
    questions.forEach((q) => {
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options).toHaveLength(4);
      q.options.forEach((opt) => expect(typeof opt === "string" && opt.length > 0).toBe(true));
      expect(Number.isInteger(q.correctIndex)).toBe(true);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThanOrEqual(3);
      expect(typeof q.question === "string" && q.question.length > 0).toBe(true);
      expect(typeof q.explanation === "string" && q.explanation.length > 0).toBe(true);
    });
  });
});
