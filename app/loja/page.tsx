import type { Metadata } from "next";
import { CabecaInterna } from "@/components/cabeca-interna";
import { FiltroCategorias, Vitrine } from "@/components/loja/vitrine";
import { getCatalogo } from "@/lib/loja/api";

export const metadata: Metadata = {
  title: "Loja",
  description: "Catálogo Costa Castro — cama, banho, baby e bordados. Consulte pelo WhatsApp.",
};

export default async function LojaPage() {
  const catalogo = await getCatalogo();

  return (
    <>
      <CabecaInterna rotulo="Loja" titulo="Loja" lead="Catálogo completo — disponibilidade e valores no atendimento." />
      <div className="conteudo-site">
        <section className="secao">
          <FiltroCategorias catalogo={catalogo} />
          <Vitrine catalogo={catalogo} produtos={catalogo.products} />
        </section>
      </div>
    </>
  );
}
