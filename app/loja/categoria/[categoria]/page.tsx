import { CabecaInterna } from "@/components/cabeca-interna";
import { FiltroCategorias, Vitrine } from "@/components/loja/vitrine";
import { getCatalogo, produtosDaCategoria } from "@/lib/loja/api";

export default async function CategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria: slug } = await params;
  const catalogo = await getCatalogo();
  const { categoria, produtos } = produtosDaCategoria(catalogo, slug);

  return (
    <>
      <CabecaInterna
        rotulo="Loja"
        titulo={categoria?.name ?? "Categoria"}
        lead="Catálogo completo — disponibilidade e valores no atendimento."
      />
      <div className="conteudo-site">
        <section className="secao">
          <FiltroCategorias catalogo={catalogo} ativa={slug} />
          <Vitrine catalogo={catalogo} produtos={produtos} />
        </section>
      </div>
    </>
  );
}
