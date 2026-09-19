import type { MetadataRoute } from "next";
import { getCatalogo } from "@/lib/loja/api";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalogo = await getCatalogo();
  return [
    { url: SITE },
    { url: `${SITE}/loja` },
    ...catalogo.categories.map((c) => ({ url: `${SITE}/loja/categoria/${c.slug}` })),
    ...catalogo.products.map((p) => ({ url: `${SITE}/loja/${p.slug}` })),
  ];
}
