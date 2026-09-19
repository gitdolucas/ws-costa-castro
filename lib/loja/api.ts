/**
 * Cliente da API pública da Loja. Só roda no servidor do site: o token
 * nunca vai ao navegador. Sem admin no ar, aponte CARA_CERTA_API_URL para
 * o servidor de fixture (`pnpm fixture:loja` no admin).
 * Kit 1.0.0-pre. Copie, não importe (→ src/lib/loja).
 */
import "server-only";
import type { Catalogo, Produto } from "./types";

export class ErroApiLoja extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string | null,
  ) {
    super(`API da Loja: HTTP ${status}${codigo ? ` ${codigo}` : ""}`);
    this.name = "ErroApiLoja";
  }
}

function config() {
  const base = process.env.CARA_CERTA_API_URL; // …/api/public/v1/<org>
  const org = process.env.CARA_CERTA_ORG;
  if (!base || !org) throw new Error("Defina CARA_CERTA_API_URL e CARA_CERTA_ORG");
  return { base: base.replace(/\/$/, ""), org, token: process.env.CARA_CERTA_SITE_TOKEN ?? "", bypass: process.env.CARA_CERTA_BYPASS_SECRET };
}

/** Tag de cache que o webhook do admin revalida quando o catálogo muda. */
export const tagLoja = (org: string) => `loja:${org}`;

export async function getCatalogo(): Promise<Catalogo> {
  const { base, org, token, bypass } = config();
  const res = await fetch(`${base}/loja/catalogo`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", ...(bypass ? { "x-vercel-protection-bypass": bypass } : {}) },
    // "max": revalida pela tag (webhook); 1 h é só a rede de segurança.
    next: { tags: [tagLoja(org)], revalidate: 3600 },
  });
  if (!res.ok) {
    const corpo = (await res.json().catch(() => null)) as { erro?: { codigo?: string } } | null;
    throw new ErroApiLoja(res.status, corpo?.erro?.codigo ?? null);
  }
  return (await res.json()) as Catalogo;
}

export async function getProduto(slug: string): Promise<{ catalogo: Catalogo; produto: Produto | null }> {
  const catalogo = await getCatalogo();
  return { catalogo, produto: catalogo.products.find((p) => p.slug === slug) ?? null };
}

export function produtosDaCategoria(catalogo: Catalogo, slug: string) {
  const categoria = catalogo.categories.find((c) => c.slug === slug) ?? null;
  return {
    categoria,
    produtos: categoria ? catalogo.products.filter((p) => p.categoryIds.includes(categoria.id)) : [],
  };
}
