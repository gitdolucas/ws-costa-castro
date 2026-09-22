import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { VitrineEditorial } from "@/components/vitrine-editorial";
import { VITRINE } from "@/lib/content/vitrine";

export const metadata: Metadata = {
  title: "Vitrine",
  description: "Curadoria Costa Castro — cama, banho, baby e bordados. Consulte pelo WhatsApp.",
};

export default function LojaPage() {
  return (
    <section className="secao pagina-interna" aria-labelledby="titulo-loja">
      <Reveal>
        <h1 id="titulo-loja">Vitrine</h1>
        <p className="lead">Seleção editorial — disponibilidade e valores no atendimento.</p>
      </Reveal>
      <VitrineEditorial itens={VITRINE} />
    </section>
  );
}
