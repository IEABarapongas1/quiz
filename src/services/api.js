// Camada de acesso ao Supabase. saveResult é best-effort: nunca lança,
// retornando { ok, data?, error? } para a UI tratar falhas de forma
// não-bloqueante (RF-09 / AC-05).
//
// O frontend grava direto na tabela `quiz_results` usando a chave publishable;
// a segurança é garantida pelas policies de RLS (ver supabase/schema.sql).

import { supabase } from "./supabase.js";

const TABLE = "quiz_results";

export async function saveResult({ sessionId, totalScore, level1Score, level2Score }) {
  if (!supabase) {
    return { ok: false, error: "Supabase não configurado (.env ausente)" };
  }

  try {
    // Sem .select() de volta: o save é best-effort e não precisamos do registro
    // gravado, o que nos permite manter o SELECT bloqueado por RLS.
    const { error } = await supabase.from(TABLE).insert({
      session_id: sessionId,
      total_score: totalScore,
      level1_score: level1Score,
      level2_score: level2Score,
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || "Falha de rede" };
  }
}

export async function getResult(sessionId) {
  if (!supabase) {
    return { ok: false, error: "Supabase não configurado (.env ausente)" };
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select()
      .eq("session_id", sessionId)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message || "Falha de rede" };
  }
}
