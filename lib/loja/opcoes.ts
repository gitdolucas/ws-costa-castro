/**
 * Escolha de variante pelas opções do produto (Tamanho, Cor…), em vez de
 * uma lista plana de nomes. Kit 1.0.0-pre. Copie, não importe (→ src/lib/loja).
 */
import type { Produto, Variante } from "./types";

export type Escolhas = Record<string, string>;

/** Primeira variante disponível (ou a primeira, se nenhuma estiver). */
export function varianteInicial(produto: Produto): Variante {
  return produto.variants.find((v) => v.available) ?? produto.variants[0];
}

export function varianteDe(produto: Produto, escolhas: Escolhas): Variante | null {
  if (!produto.options.length) return produto.variants[0] ?? null;
  return (
    produto.variants.find((v) => produto.options.every((o) => v.optionValues[o.name] === escolhas[o.name])) ?? null
  );
}

/** Para cada valor de uma opção: existe variante disponível com ele, mantidas as outras escolhas? */
export function valoresDaOpcao(produto: Produto, opcao: string, escolhas: Escolhas) {
  const def = produto.options.find((o) => o.name === opcao);
  if (!def) return [];
  return def.values.map((valor) => {
    const v = varianteDe(produto, { ...escolhas, [opcao]: valor });
    return { valor, existe: v !== null, disponivel: v?.available ?? false };
  });
}

/** Troca uma opção; se a combinação não existir, cai na primeira variante disponível com esse valor. */
export function escolher(produto: Produto, escolhas: Escolhas, opcao: string, valor: string): Escolhas {
  const proximas = { ...escolhas, [opcao]: valor };
  if (varianteDe(produto, proximas)) return proximas;
  const alternativa =
    produto.variants.find((v) => v.available && v.optionValues[opcao] === valor) ??
    produto.variants.find((v) => v.optionValues[opcao] === valor);
  return alternativa ? { ...alternativa.optionValues } : escolhas;
}
