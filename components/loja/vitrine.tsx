import Link from "next/link";
import type { Catalogo, Produto } from "@/lib/loja/types";
import { formatarDinheiro } from "@/lib/loja/dinheiro";
import { FotoProduto } from "./foto";

/**
 * Vitrine — UI genérica do kit de vitrine/catálogo.
 * Composição editorial escalonada, não grid uniforme. Server component.
 */

const tons = ["folha", "caqui", "oliva"] as const;

export function PecaVitrine({ produto, catalogo, indice }: { produto: Produto; catalogo: Catalogo; indice: number }) {
  const { locale, currency } = catalogo.loja;
  const disponiveis = produto.variants.filter((v) => v.available);
  const menor = Math.min(...(disponiveis.length ? disponiveis : produto.variants).map((v) => v.priceCents));
  const categoria = catalogo.categories.find((c) => c.id === produto.categoryIds[0]);

  return (
    <Link href={`/loja/${produto.slug}`} className="peca" data-indisponivel={disponiveis.length === 0 || undefined}>
      <FotoProduto imagem={produto.images[0]} tom={tons[indice % tons.length]} className="peca-foto" />
      <span className="etiqueta">
        <span className="etiqueta-cat">{categoria?.name}</span>
        <span className="etiqueta-nome">{produto.name}</span>
        <span className="etiqueta-rodape">
          <span>{produto.options[0]?.values.join(" · ") ?? produto.variants[0].name}</span>
          <span className="etiqueta-preco">
            {new Set(produto.variants.map((v) => v.priceCents)).size > 1 ? "a partir de " : ""}
            {formatarDinheiro(menor, locale, currency)}
          </span>
        </span>
      </span>
    </Link>
  );
}

export function Vitrine({ catalogo, produtos }: { catalogo: Catalogo; produtos?: Produto[] }) {
  const lista = produtos ?? catalogo.products;
  if (!lista.length) return <p className="vitrine-vazia">Nenhuma peça nesta seção por enquanto.</p>;
  return (
    <ul className="vitrine" role="list">
      {lista.map((p, i) => (
        <li key={p.id} className={`vitrine-item vitrine-item-${(i % 5) + 1}`}>
          <PecaVitrine produto={p} catalogo={catalogo} indice={i} />
        </li>
      ))}
    </ul>
  );
}

export function FiltroCategorias({ catalogo, ativa }: { catalogo: Catalogo; ativa?: string }) {
  return (
    <nav className="filtro" aria-label="Seções da loja">
      <Link href="/loja" aria-current={!ativa ? "page" : undefined}>
        Tudo
      </Link>
      {catalogo.categories.map((c) => (
        <Link key={c.id} href={`/loja/categoria/${c.slug}`} aria-current={ativa === c.slug ? "page" : undefined}>
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
