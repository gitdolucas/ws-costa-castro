/**
 * ATÉ L3: pedido montado no servidor do site, com o mesmo contrato do
 * `POST /loja/pedidos` do admin (PedidoCriado / ErroLoja). Preço sempre do
 * catálogo servido pela API (fixture), nunca do navegador. Quando o admin
 * criar pedidos, este arquivo sai e o kit ganha `criarPedido()` em api.ts.
 */
import "server-only";
import { getCatalogo } from "./api";
import { montarMensagem, montarWaUrl } from "./mensagem";
import type { ErroLoja, Linha, LinhaMudou, PedidoCriado } from "./types";
import { WHATSAPP_E164 } from "@/lib/site";

export type ResultadoPedido = { ok: true; pedido: PedidoCriado } | { ok: false; erro: ErroLoja["erro"] };

let seq = 1041;

export async function pedidoLocal({
  lines,
  customer,
}: {
  lines: Linha[];
  customer: Record<string, string>;
}): Promise<ResultadoPedido> {
  const catalogo = await getCatalogo();
  const variantes = new Map(
    catalogo.products.flatMap((p) => p.variants.map((v) => [v.id, { produto: p, variante: v }] as const)),
  );

  if (!lines.length || lines.length > 50) {
    return {
      ok: false,
      erro: {
        codigo: "PEDIDO_INVALIDO",
        mensagem: "A sacola está vazia.",
        detalhes: { issues: [{ path: "lines", message: "1 a 50 linhas" }] },
      },
    };
  }

  const mudou = lines.flatMap((l): LinhaMudou[] => {
    const achado = variantes.get(l.variantId);
    if (!achado) return [{ variantId: l.variantId, reason: "inactive", maxQty: 0 }];
    const { variante } = achado;
    if (!variante.available) return [{ variantId: l.variantId, reason: "unavailable", maxQty: 0 }];
    if (l.qty < 1 || l.qty > variante.maxQty) return [{ variantId: l.variantId, reason: "over_max", maxQty: variante.maxQty }];
    return [];
  });
  if (mudou.length) {
    return {
      ok: false,
      erro: { codigo: "CARRINHO_MUDOU", mensagem: "Alguns itens da sacola mudaram. Confira antes de finalizar.", detalhes: { lines: mudou } },
    };
  }

  const campos = catalogo.loja.checkoutFields.filter((c) => !c.showWhen || customer[c.showWhen.key] === c.showWhen.equals);
  const faltando = campos.filter((c) => c.required && !customer[c.key]?.trim());
  if (faltando.length) {
    return {
      ok: false,
      erro: {
        codigo: "CAMPO_CHECKOUT_INVALIDO",
        mensagem: "Preencha os campos obrigatórios.",
        detalhes: { fields: faltando.map((c) => ({ key: c.key, reason: "required" as const })) },
      },
    };
  }

  const itens = lines.map((l) => {
    const { produto, variante } = variantes.get(l.variantId)!;
    return {
      variantId: l.variantId,
      name: `${produto.name} — ${variante.name}`,
      unitCents: variante.priceCents,
      qty: l.qty,
      lineCents: variante.priceCents * l.qty,
    };
  });
  const subtotalCents = itens.reduce((s, i) => s + i.lineCents, 0);
  const code = `#CC-${++seq}`;
  const message = montarMensagem({ loja: catalogo.loja, code, itens, subtotalCents, customer });

  return {
    ok: true,
    pedido: {
      code,
      status: "pending_whatsapp",
      subtotalCents,
      currency: catalogo.loja.currency,
      lines: itens,
      message,
      waUrl: montarWaUrl(WHATSAPP_E164, message),
    },
  };
}
