import { formatarDinheiro } from "./dinheiro";
import type { ConfigLoja } from "./types";

type Cliente = Record<string, string>;

/**
 * Mensagem do pedido para o WhatsApp. No admin, sai do template do tenant;
 * no piloto sem admin, deste texto fixo com o mesmo formato. Até L3.
 */

type Item = { name: string; qty: number; lineCents: number };

export function montarMensagem({
  loja,
  code,
  itens,
  subtotalCents,
  customer,
}: {
  loja: ConfigLoja;
  code: string;
  itens: Item[];
  subtotalCents: number;
  customer: Cliente;
}) {
  const din = (c: number) => formatarDinheiro(c, loja.locale, loja.currency);
  // Linha só com placeholder vazio cai fora, como no template do admin.
  const dados = [
    loja.shippingNote ? `Subtotal: ${din(subtotalCents)} (${loja.shippingNote})` : `Subtotal: ${din(subtotalCents)}`,
    customer.name ? `Nome: ${customer.name}` : "",
    customer.fulfilment ? `Recebimento: ${customer.fulfilment} ${customer.address ?? ""}`.trim() : "",
    customer.payment ? `Pagamento: ${customer.payment}` : "",
    customer.notes ? `Obs.: ${customer.notes}` : "",
  ].filter(Boolean);
  return [
    `Olá, ${loja.name}! Gostaria de fazer o pedido ${code}:`,
    "",
    ...itens.map((i) => `${i.qty}x ${i.name} — ${din(i.lineCents)}`),
    "",
    ...dados,
  ].join("\n");
}

export function montarWaUrl(numero: string, mensagem: string) {
  let texto = mensagem;
  let url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  while (url.length > 4000 && texto.includes("\n")) {
    texto = texto.slice(0, texto.lastIndexOf("\n"));
    url = `https://wa.me/${numero}?text=${encodeURIComponent(`${texto}\n(pedido completo com a loja)`)}`;
  }
  return url;
}
