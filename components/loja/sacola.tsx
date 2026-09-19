"use client";

import Link from "next/link";
import type { CampoCheckout } from "@/lib/loja/types";
import { useCarrinho, useDinheiro } from "@/lib/loja/ganchos";
import { Stepper } from "./produto";
import { CheckoutWhatsApp, PedidoEnviado } from "./checkout";
import { Folha } from "@/components/ornamentos";

/** Sacola: linhas, avisos de reconciliação e checkout. UI do kit. */
export function Sacola({ campos, notaFrete }: { campos: CampoCheckout[]; notaFrete: string | null }) {
  const { linhas, subtotalCents, avisos, pronto, definirQtd, remover, dispensarAvisos } = useCarrinho();
  const dinheiro = useDinheiro();

  if (!pronto) return <p className="sacola-carregando">Abrindo a sacola…</p>;

  return (
    <div className="sacola">
      {avisos.length > 0 && (
        <div className="aviso" role="status">
          <p>Algumas peças mudaram desde a sua última visita:</p>
          <ul>
            {avisos.map((a) => (
              <li key={a.variantId + a.tipo}>
                {a.nome}:{" "}
                {a.tipo === "removed" ? "saiu da sacola" : a.tipo === "qty_reduced" ? "quantidade ajustada" : "preço atualizado"}
              </li>
            ))}
          </ul>
          <button type="button" className="link" onClick={dispensarAvisos}>
            Entendi
          </button>
        </div>
      )}

      {linhas.length === 0 ? (
        <div className="sacola-vazia">
          <PedidoEnviado />
          <Folha className="sacola-vazia-folha" />
          <p>Sua sacola está vazia.</p>
          <Link href="/loja" className="botao botao-secundario">
            Ver a coleção
          </Link>
        </div>
      ) : (
        <div className="sacola-grade">
          <section aria-labelledby="titulo-pecas" className="sacola-pecas">
            <h2 id="titulo-pecas" className="rotulo">
              Peças escolhidas
            </h2>
            <ul role="list">
              {linhas.map((l) => (
                <li key={l.variantId} className="linha">
                  <div className="linha-nome">
                    <Link href={`/loja/${l.variante.slug}`}>{l.variante.produto}</Link>
                    <span>{l.variante.nome}</span>
                  </div>
                  <Stepper
                    valor={l.qty}
                    min={1}
                    max={l.variante.maxQty}
                    onChange={(n) => definirQtd(l.variantId, n)}
                    rotulo={`Quantidade de ${l.variante.produto}`}
                  />
                  <span className="linha-valor">{dinheiro(l.lineCents)}</span>
                  <button type="button" className="link linha-remover" onClick={() => remover(l.variantId)}>
                    Remover<span className="sr-only"> {l.variante.produto}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="subtotal">
              <span>Subtotal</span>
              <strong>{dinheiro(subtotalCents)}</strong>
            </p>
            {notaFrete && <p className="nota">{notaFrete}, acertado pelo WhatsApp.</p>}
          </section>

          <CheckoutWhatsApp campos={campos} />

          {/* Celular: o CTA fica à vista enquanto a pessoa revisa as peças. */}
          <div className="barra-finalizar">
            <span>
              <small>Subtotal</small> {dinheiro(subtotalCents)}
            </span>
            <a href="#checkout" className="botao botao-primario">
              Finalizar pelo WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
