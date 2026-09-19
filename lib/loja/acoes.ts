"use server";

/**
 * ATÉ L3: action do checkout do piloto. Em L3 o kit traz a versão final
 * (BotID + POST /loja/pedidos no admin). Aqui o pedido é montado no servidor
 * do site, com o mesmo contrato.
 */
import { pedidoLocal, type ResultadoPedido } from "./pedido-local";
import type { Linha } from "./types";

export async function finalizarPedido(entrada: {
  idempotencyKey: string;
  lines: Linha[];
  customer: Record<string, string>;
}): Promise<ResultadoPedido> {
  const lines = (entrada.lines ?? [])
    .filter((l) => typeof l.variantId === "string" && Number.isInteger(l.qty))
    .map((l) => ({ variantId: l.variantId, qty: l.qty }));
  const customer = Object.fromEntries(
    Object.entries(entrada.customer ?? {}).map(([k, v]) => [k, String(v).slice(0, 500)]),
  );
  try {
    return await pedidoLocal({ lines, customer });
  } catch {
    return {
      ok: false,
      erro: { codigo: "WHATSAPP_SEM_NUMERO", mensagem: "Não conseguimos enviar agora. Tente de novo em instantes." },
    };
  }
}
