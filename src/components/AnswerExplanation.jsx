import { memo } from "react";

// Bloco reutilizável de explicação, usado no feedback imediato e no gabarito final.
function AnswerExplanation({ explanation }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/80">
      {explanation}
    </div>
  );
}

export default memo(AnswerExplanation);
