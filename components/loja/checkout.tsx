"use client";

import { useEffect, useState } from "react";
import { finalizarPedido } from "@/lib/loja/acoes";
import type { CampoCheckout, ErroLoja } from "@/lib/loja/types";
import { useCarrinho } from "@/lib/loja/ganchos";

type UltimoPedido = { code: string; waUrl: string };
const CHAVE_ULTIMO = "cc-loja:ultimo-pedido";

/**
 * Formulário a partir dos campos do tenant. O admin precifica e grava; aqui só
 * abre o WhatsApp com o link que voltou. UI do kit.
 */
export function CheckoutWhatsApp({ campos }: { campos: CampoCheckout[] }) {
  const { linhas, limpar } = useCarrinho();
  const [valores, setValores] = useState<Record<string, string>>({ fulfilment: "Entrega" });
  const [status, setStatus] = useState<"parado" | "enviando" | "erro" | "feito">("parado");
  const [erro, setErro] = useState<ErroLoja["erro"] | null>(null);
  const [ultimo, setUltimo] = useState<UltimoPedido | null>(null);

  useEffect(() => {
    try {
      const salvo = sessionStorage.getItem(CHAVE_ULTIMO);
      if (salvo) setUltimo(JSON.parse(salvo));
    } catch {}
  }, []);

  const visiveis = campos.filter((c) => !c.showWhen || valores[c.showWhen.key] === c.showWhen.equals);
  const erroDoCampo = (chave: string) =>
    erro?.codigo === "CAMPO_CHECKOUT_INVALIDO" && erro.detalhes.fields.some((f) => f.key === chave);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    // Janela aberta no clique, antes do await: navegador não bloqueia.
    const janela = window.open("", "_blank");
    setStatus("enviando");
    setErro(null);
    const r = await finalizarPedido({
      idempotencyKey: crypto.randomUUID(),
      lines: linhas.map(({ variantId, qty }) => ({ variantId, qty })),
      customer: Object.fromEntries(visiveis.map((c) => [c.key, valores[c.key] ?? ""])),
    });
    if (!r.ok) {
      janela?.close();
      setErro(r.erro);
      setStatus("erro");
      return;
    }
    const pedido = { code: r.pedido.code, waUrl: r.pedido.waUrl };
    try {
      sessionStorage.setItem(CHAVE_ULTIMO, JSON.stringify(pedido));
    } catch {}
    setUltimo(pedido);
    setStatus("feito");
    limpar();
    if (janela) janela.location.href = pedido.waUrl;
    else window.location.href = pedido.waUrl;
  }

  return (
    <form id="checkout" className="checkout" onSubmit={enviar} noValidate data-status={status}>
      <h2 className="rotulo">Seus dados</h2>
      {visiveis.map((c) => (
        <Campo
          key={c.key}
          campo={c}
          valor={valores[c.key] ?? ""}
          invalido={erroDoCampo(c.key)}
          onChange={(v) => setValores((s) => ({ ...s, [c.key]: v }))}
        />
      ))}

      <p className="checkout-erro" role="alert">
        {erro?.mensagem}
      </p>

      <button type="submit" className="botao botao-primario botao-whatsapp" disabled={status === "enviando" || !linhas.length}>
        {status === "enviando" ? "Preparando o pedido…" : "Finalizar pelo WhatsApp"}
      </button>
      <p className="nota">A conversa abre com o pedido pronto. Pagamento e frete são combinados com a loja.</p>

      {ultimo && (
        <p className="nota">
          Último pedido {ultimo.code}:{" "}
          <a href={ultimo.waUrl} target="_blank" rel="noopener">
            reabrir WhatsApp
          </a>
        </p>
      )}
    </form>
  );
}

/** Confirmação depois do pedido: a sacola já foi limpa, o link fica na sessão. */
export function PedidoEnviado() {
  const [ultimo, setUltimo] = useState<UltimoPedido | null>(null);
  useEffect(() => {
    try {
      const salvo = sessionStorage.getItem(CHAVE_ULTIMO);
      if (salvo) setUltimo(JSON.parse(salvo));
    } catch {}
  }, []);
  if (!ultimo) return null;
  return (
    <section className="checkout checkout-feito" aria-live="polite">
      <p className="rotulo">Pedido {ultimo.code}</p>
      <h2>Seu pedido seguiu para o WhatsApp.</h2>
      <p>Envie a mensagem que abriu para a loja confirmar peças, frete e pagamento.</p>
      <a href={ultimo.waUrl} className="botao botao-primario" target="_blank" rel="noopener">
        Reabrir WhatsApp
      </a>
    </section>
  );
}

function Campo({
  campo,
  valor,
  invalido,
  onChange,
}: {
  campo: CampoCheckout;
  valor: string;
  invalido?: boolean;
  onChange: (v: string) => void;
}) {
  const id = `campo-${campo.key}`;
  const idErro = `${id}-erro`;
  const comum = {
    id,
    name: campo.key,
    value: valor,
    required: campo.required,
    "aria-invalid": invalido || undefined,
    "aria-describedby": invalido ? idErro : undefined,
  };
  return (
    <div className="campo">
      <label htmlFor={id}>
        {campo.label}
        {!campo.required && <span className="opcional"> (opcional)</span>}
      </label>
      {campo.type === "select" ? (
        <select {...comum} onChange={(e) => onChange(e.target.value)}>
          {!campo.required && <option value="">Escolher depois</option>}
          {campo.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : campo.type === "textarea" ? (
        <textarea {...comum} rows={3} maxLength={campo.maxLength} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          {...comum}
          type={campo.type === "cep" ? "text" : campo.type}
          maxLength={campo.maxLength}
          autoComplete={campo.key === "name" ? "name" : campo.type === "tel" ? "tel" : campo.key === "address" ? "street-address" : campo.type === "cep" ? "postal-code" : undefined}
          inputMode={campo.type === "tel" ? "tel" : campo.type === "cep" ? "numeric" : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {invalido && (
        <span id={idErro} className="campo-erro">
          Campo obrigatório.
        </span>
      )}
    </div>
  );
}
