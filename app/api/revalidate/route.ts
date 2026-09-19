/**
 * Corpo de `app/api/revalidate/route.ts` no site. Uma rota só para blog e
 * loja: o admin manda `{ tags: [...] }` com `Bearer REVALIDATE_SECRET`.
 * Copie, não importe. Kit comum 1.0.0-pre.
 */
import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

const PERMITIDAS = /^(blog|loja|sitemap):[a-z0-9-]+(:[a-z0-9-]+)?$/;
const MAX_TAGS = 20;

function segredoConfere(cabecalho: string | null) {
  const segredo = process.env.REVALIDATE_SECRET;
  if (!segredo || !cabecalho?.startsWith("Bearer ")) return false;
  const a = Buffer.from(cabecalho.slice(7));
  const b = Buffer.from(segredo);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!segredoConfere(req.headers.get("authorization"))) {
    return Response.json({ erro: { codigo: "TOKEN_INVALIDO", mensagem: "Segredo inválido." } }, { status: 401 });
  }
  const corpo = (await req.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(corpo?.tags) ? corpo.tags : null;
  if (!tags?.length || tags.length > MAX_TAGS || !tags.every((t) => typeof t === "string" && PERMITIDAS.test(t))) {
    return Response.json({ erro: { codigo: "PEDIDO_INVALIDO", mensagem: "Tags inválidas." } }, { status: 400 });
  }
  for (const tag of tags as string[]) revalidateTag(tag, "max");
  return Response.json({ revalidadas: tags });
}
