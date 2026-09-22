import type { MetadataRoute } from "next";
import { SITE, SITE_INDEXAVEL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXAVEL) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
