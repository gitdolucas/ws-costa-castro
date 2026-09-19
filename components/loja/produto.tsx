"use client";

import { useState } from "react";
import Link from "next/link";
import type { Produto } from "@/lib/loja/types";
import { useCarrinho, useDinheiro } from "@/lib/loja/ganchos";
import { escolher, valoresDaOpcao, varianteDe, varianteInicial } from "@/lib/loja/opcoes";

/** Escolha por opção (Tamanho…) + quantidade + Adicionar à sacola. UI do kit na cartela da Costa Castro. */
export function CompraProduto({ produto }: { produto: Produto }) {
  const [escolhas, setEscolhas] = useState(() => ({ ...varianteInicial(produto).optionValues }));
  const [qtd, setQtd] = useState(1);
  const [estado, setEstado] = useState<"parado" | "adicionado">("parado");
  const { adicionar, linhas } = useCarrinho();
  const dinheiro = useDinheiro();

  const variante = varianteDe(produto, escolhas) ?? varianteInicial(produto);
  const naSacola = linhas.find((l) => l.variantId === variante.id)?.qty ?? 0;
  const limite = Math.max(0, variante.maxQty - naSacola);

  function aoAdicionar() {
    if (adicionar(variante.id, Math.min(qtd, limite))) setEstado("adicionado");
    setQtd(1);
  }

  return (
    <div className="compra">
      {produto.options.map((o) => (
        <fieldset key={o.name} className="tamanhos">
          <legend>{o.name}</legend>
          {valoresDaOpcao(produto, o.name, escolhas).map(({ valor, existe, disponivel }) => (
            <label key={valor} data-indisponivel={!disponivel || undefined}>
              <input
                type="radio"
                name={`opcao-${o.name}`}
                value={valor}
                checked={escolhas[o.name] === valor}
                disabled={!existe || !disponivel}
                onChange={() => {
                  setEscolhas(escolher(produto, escolhas, o.name, valor));
                  setEstado("parado");
                  setQtd(1);
                }}
              />
              <span>{valor}</span>
              {existe && !disponivel && <small>esgotado</small>}
            </label>
          ))}
        </fieldset>
      ))}

      <p className="compra-preco">
        {variante.compareAtCents && variante.compareAtCents > variante.priceCents && (
          <s aria-label={`De ${dinheiro(variante.compareAtCents)}`}>{dinheiro(variante.compareAtCents)}</s>
        )}{" "}
        {dinheiro(variante.priceCents)}
      </p>

      <div className="compra-linha">
        <Stepper valor={qtd} min={1} max={Math.max(1, limite)} onChange={setQtd} rotulo={`Quantidade de ${produto.name}`} />
        <button
          type="button"
          className="botao botao-primario"
          onClick={aoAdicionar}
          disabled={!variante.available || limite < 1}
          data-state={estado}
        >
          {limite < 1 && variante.available ? "Limite na sacola" : "Adicionar à sacola"}
        </button>
      </div>

      <p className="compra-status" aria-live="polite">
        {estado === "adicionado" && (
          <>
            Na sacola. <Link href="/loja/sacola">Ver sacola e finalizar</Link>
          </>
        )}
      </p>
    </div>
  );
}

export function Stepper({
  valor,
  min,
  max,
  onChange,
  rotulo,
}: {
  valor: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  rotulo: string;
}) {
  return (
    <div className="stepper" role="group" aria-label={rotulo} data-no-minimo={valor <= min || undefined} data-no-maximo={valor >= max || undefined}>
      <button type="button" onClick={() => onChange(Math.max(min, valor - 1))} disabled={valor <= min} aria-label="Diminuir">
        −
      </button>
      <output aria-live="polite">{valor}</output>
      <button type="button" onClick={() => onChange(Math.min(max, valor + 1))} disabled={valor >= max} aria-label="Aumentar">
        +
      </button>
    </div>
  );
}
