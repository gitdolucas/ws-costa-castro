"use client";

import { useCarrinho } from "@/lib/loja/ganchos";

export function ContagemSacola() {
  const { quantidade } = useCarrinho();
  return (
    <span className="contagem" data-vazio={quantidade === 0 || undefined} aria-live="polite">
      <span className="sr-only">, </span>
      {quantidade}
      <span className="sr-only"> {quantidade === 1 ? "peça" : "peças"}</span>
    </span>
  );
}
