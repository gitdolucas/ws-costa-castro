import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalogo, getProduto } from "@/lib/loja/api";
import { produtoJsonLd } from "@/lib/loja/jsonld";
import { SITE } from "@/lib/site";
import { FotoProduto } from "@/components/loja/foto";
import { CompraProduto } from "@/components/loja/produto";
import { Vitrine } from "@/components/loja/vitrine";

export async function generateStaticParams() {
  const catalogo = await getCatalogo();
  return catalogo.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/loja/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { produto } = await getProduto(slug);
  return produto ? { title: produto.name, description: produto.description ?? undefined } : {};
}

export default async function PaginaProduto(props: PageProps<"/loja/[slug]">) {
  const { slug } = await props.params;
  const { catalogo, produto } = await getProduto(slug);
  if (!produto) notFound();

  const categoria = catalogo.categories.find((c) => c.id === produto.categoryIds[0]);
  const colecao = produto.tags.find((t) => t.startsWith("colecao:"));
  const combina = colecao
    ? catalogo.products.filter((p) => p.id !== produto.id && p.tags.includes(colecao))
    : [];

  return (
    <article className="produto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(
            produtoJsonLd(produto, catalogo.loja, { url: SITE, organizacaoId: `${SITE}/#empresa` }),
          ).replace(/</g, "\\u003c") }}
      />
      <nav className="trilha" aria-label="Você está em">
        <Link href="/loja">Coleção</Link>
        <span aria-hidden="true"> / </span>
        {categoria && <Link href={`/loja/categoria/${categoria.slug}`}>{categoria.name}</Link>}
      </nav>

      <div className="produto-grade">
        <FotoProduto imagem={produto.images[0]} priority className="produto-foto" />

        <div className="produto-info">
          <span className="etiqueta etiqueta-grande">
            {produto.badge && <span className="etiqueta-cat">{produto.badge}</span>}
            <h1 className="etiqueta-nome">{produto.name}</h1>
          </span>
          {produto.description && <p className="produto-desc">{produto.description}</p>}

          <CompraProduto produto={produto} />

          <dl className="ficha-tecnica ficha-produto">
            {Object.entries(produto.meta).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {combina.length > 0 && (
        <section className="secao" aria-labelledby="titulo-combina">
          <header className="secao-cabeca">
            <p className="rotulo">Monte o conjunto</p>
            <h2 id="titulo-combina">Combina com</h2>
          </header>
          <Vitrine catalogo={catalogo} produtos={combina} />
        </section>
      )}
    </article>
  );
}
