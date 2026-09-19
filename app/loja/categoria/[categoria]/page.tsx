import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalogo, produtosDaCategoria } from "@/lib/loja/api";
import { DESCRICAO_SECAO } from "@/lib/secoes";
import { FiltroCategorias, Vitrine } from "@/components/loja/vitrine";

export async function generateStaticParams() {
  const catalogo = await getCatalogo();
  return catalogo.categories.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata(props: PageProps<"/loja/categoria/[categoria]">): Promise<Metadata> {
  const { categoria } = await props.params;
  const c = (await getCatalogo()).categories.find((x) => x.slug === categoria);
  return c ? { title: c.name, description: DESCRICAO_SECAO[c.slug] } : {};
}

export default async function Categoria(props: PageProps<"/loja/categoria/[categoria]">) {
  const { categoria } = await props.params;
  const catalogo = await getCatalogo();
  const { categoria: c, produtos } = produtosDaCategoria(catalogo, categoria);
  if (!c) notFound();
  return (
    <div className="pagina-loja">
      <header className="loja-cabeca">
        <p className="rotulo">A coleção</p>
        <h1>{c.name}</h1>
        {DESCRICAO_SECAO[c.slug] && <p className="loja-desc">{DESCRICAO_SECAO[c.slug]}</p>}
        <FiltroCategorias catalogo={catalogo} ativa={c.slug} />
      </header>
      <Vitrine catalogo={catalogo} produtos={produtos} />
    </div>
  );
}
