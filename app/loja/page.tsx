import type { Metadata } from "next";
import { CabecaInterna } from "@/components/cabeca-interna";
import { VitrineEditorial } from "@/components/vitrine-editorial";
import { VITRINE } from "@/lib/content/vitrine";

export const metadata: Metadata = {
  title: "Vitrine",
  description: "Curadoria Costa Castro — cama, banho, baby e bordados. Consulte pelo WhatsApp.",
};

export default function LojaPage() {
  return (
    <>
      <CabecaInterna rotulo="Vitrine" titulo="Vitrine" lead="Seleção editorial — disponibilidade e valores no atendimento." />
      <div className="conteudo-site">
        <section className="secao">
          <VitrineEditorial itens={VITRINE} />
        </section>
      </div>
    </>
  );
}
