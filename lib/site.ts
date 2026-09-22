/** Verdade central do site — Mapa do negócio v1. */

export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.costacastro.com.br";

/** E.164 sem + para wa.me */
export const WHATSAPP_E164 = process.env.NEXT_PUBLIC_WHATSAPP ?? "5521984588952";

export const INSTAGRAM_URL = "https://www.instagram.com/costacastroloja/";

export const CIDADES_ATENDIMENTO = ["Niterói", "Maricá"] as const;

export const TAGLINE = "Cama, mesa e banho — conforto, qualidade e sofisticação para o seu lar.";

export const MENSAGEM_WHATSAPP_PADRAO =
  "Olá! Vim pelo site da Costa Castro e gostaria de saber mais sobre cama, mesa e banho.";

/** Preview permanece noindex até go-live humano. */
export const SITE_INDEXAVEL = process.env.NEXT_PUBLIC_SITE_INDEXAVEL === "1";

export const whatsappUrl = (texto = MENSAGEM_WHATSAPP_PADRAO) =>
  `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(texto)}`;

export function whatsappUrlComContexto(secao: string) {
  return whatsappUrl(`${MENSAGEM_WHATSAPP_PADRAO} (${secao})`);
}
