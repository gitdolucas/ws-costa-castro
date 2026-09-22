import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CabecaInterna } from "@/components/cabeca-interna";
import { FotoProduto } from "@/components/loja/foto";
import { CompraProduto } from "@/components/loja/produto";
import { resumirCatalogo } from "@/lib/loja/carrinho";
import { CarrinhoProvider } from "@/lib/loja/ganchos";
import { getProduto } from "@/lib/loja/api";
import { produtoJsonLd } from "@/lib/loja/jsonld";
import { SITE } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { produto } = await getProduto(slug);
  if (!produto) return {};
  return {
    title: produto.name,
    description: produto.description ?? undefined,
  };
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { catalogo, produto } = await getProduto(slug);
  if (!produto) notFound();

  const { loja } = catalogo;
  const variantes = resumirCatalogo(catalogo);
  const jsonLd = produtoJsonLd(produto, loja, { url: SITE, organizacaoId: `${SITE}/#organizacao` });
  // Mídia aprovada apenas sob o namespace costa-castro/ (fixture ainda sem imagens: lacuna para o media_manager).
  const imagem = produto.images[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CabecaInterna rotulo="Loja" titulo={produto.name} />
      <div className="conteudo-site">
        <p className="trilha">
          <Link href="/loja">Loja</Link> / {produto.name}
        </p>
        <div className="produto-grade">
          <FotoProduto imagem={imagem} className="produto-foto" priority />
          <div className="produto-info">
            {produto.description && <p className="produto-desc">{produto.description}</p>}
            <CarrinhoProvider tenant={loja.slug} variantes={variantes} locale={loja.locale} currency={loja.currency}>
              <CompraProduto produto={produto} />
            </CarrinhoProvider>
            {Object.keys(produto.meta).length > 0 && (
              <dl className="ficha-produto">
                {Object.entries(produto.meta).map(([chave, valor]) => (
                  <div key={chave}>
                    <dt>{chave}</dt>
                    <dd>{valor}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
