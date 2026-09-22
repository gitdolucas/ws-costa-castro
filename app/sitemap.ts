import type { MetadataRoute } from "next";
import { SITE, SITE_INDEXAVEL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_INDEXAVEL) {
    return [];
  }
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/loja`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/contato`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
