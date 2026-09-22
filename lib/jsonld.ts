import { INSTAGRAM_URL, SITE, WHATSAPP_E164 } from "@/lib/site";

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Costa Castro",
    url: SITE,
    description: "Cama, mesa e banho — conforto, qualidade e sofisticação para o seu lar.",
    areaServed: ["Niterói", "Maricá"],
    sameAs: [INSTAGRAM_URL],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${WHATSAPP_E164}`,
      availableLanguage: "Portuguese",
    },
  };
}
