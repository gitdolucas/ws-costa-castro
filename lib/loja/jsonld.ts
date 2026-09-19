/**
 * schema.org Product + Offer para a página de produto. Uma Offer por
 * variante, ligada ao @id da Organization do site (a mesma do rodapé).
 * Kit 1.0.0-pre. Copie, não importe (→ src/lib/loja).
 */
import type { ConfigLoja, Produto } from "./types";

const DISPONIVEL = "https://schema.org/InStock";
const ESGOTADO = "https://schema.org/OutOfStock";

export function produtoJsonLd(
  produto: Produto,
  loja: Pick<ConfigLoja, "name" | "currency">,
  site: { url: string; organizacaoId: string; basePath?: string },
) {
  const url = `${site.url.replace(/\/$/, "")}${site.basePath ?? "/loja"}/${produto.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#produto`,
    name: produto.name,
    url,
    ...(produto.description ? { description: textoPlano(produto.description) } : {}),
    ...(produto.images.length ? { image: produto.images.map((i) => i.url) } : {}),
    brand: { "@type": "Brand", name: loja.name },
    offers: produto.variants.map((v) => ({
      "@type": "Offer",
      name: v.name,
      price: (v.priceCents / 100).toFixed(2),
      priceCurrency: loja.currency,
      availability: v.available ? DISPONIVEL : ESGOTADO,
      url: `${url}?variante=${encodeURIComponent(v.id)}`,
      seller: { "@id": site.organizacaoId },
    })),
  };
}

/** Descrição vem em Markdown; no JSON-LD vai texto corrido. */
function textoPlano(md: string) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
