/**
 * ATÉ L3: pedido montado no servidor do site, com o mesmo contrato do
 * `POST /loja/pedidos` do admin (PedidoCriado / ErroLoja). Preço sempre do
 * catálogo servido pela API (fixture), nunca do navegador. Quando o admin
 * criar pedidos, este arquivo sai e o kit ganha `criarPedido()` em api.ts.
 */
import "server-only";
import { randomBytes } from "crypto";
import { getCatalogo } from "./api";
import { montarMensagem, montarWaUrl } from "./mensagem";
import type { ErroLoja, Linha, LinhaMudou, PedidoCriado } from "./types";
import { WHATSAPP_E164 } from "@/lib/site";

export type ResultadoPedido = { ok: true; pedido: PedidoCriado } | { ok: false; erro: ErroLoja["erro"] };

/**
 * Código curto e legível ao telefone, sem estado no servidor: prefixo do
 * slug da loja (sem identidade fixa do kit) + data/hora compacta + sufixo
 * aleatório criptograficamente forte. Cada chamada é independente — não há
 * contador nem cache entre pedidos ou reinícios do processo.
 */
function gerarCodigoPedido(slug: string): string {
  const prefixo = slug.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4) || "PED";
  const agora = new Date();
  const par = (n: number) => String(n).padStart(2, "0");
  const timestamp = `${String(agora.getFullYear()).slice(-2)}${par(agora.getMonth() + 1)}${par(agora.getDate())}${par(agora.getHours())}${par(agora.getMinutes())}`;
  const sufixo = randomBytes(3).toString("hex").toUpperCase();
  return `#${prefixo}-${timestamp}-${sufixo}`;
}

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
  const code = gerarCodigoPedido(catalogo.loja.slug);
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
