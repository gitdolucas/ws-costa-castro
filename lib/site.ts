/** Domínio provisório até a Costa Castro confirmar. */
export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.costacastro.com.br";

/** WhatsApp provisório para o botão de contato. O do checkout vem da env LOJA_WHATSAPP. */
export const WHATSAPP_CONTATO = "5521900000000";

export const whatsappUrl = (texto = "Olá! Gostaria de saber mais sobre as peças da Costa Castro.") =>
  `https://wa.me/${WHATSAPP_CONTATO}?text=${encodeURIComponent(texto)}`;
