import type { Metadata } from "next";
import { CabecaInterna } from "@/components/cabeca-interna";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import { PILARES, SOBRE_LEAD } from "@/lib/content/institucional";
import { CIDADES_ATENDIMENTO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description: SOBRE_LEAD,
};

export default function SobrePage() {
  const cidades = CIDADES_ATENDIMENTO.join(" e ");

  return (
    <>
      <CabecaInterna rotulo="Sobre" titulo="Sobre a Costa Castro" lead={SOBRE_LEAD} />
      <div className="conteudo-site">
        <section className="secao">
          <Reveal>
            <p>
              Atendemos em {cidades} com loja física, direct e WhatsApp. Nossa curadoria privilegia tecidos de
              qualidade, coordenação entre peças e o cuidado nos detalhes — incluindo bordados personalizados para
              presentes e enxovais.
            </p>
          </Reveal>
        </section>
        <section className="secao" aria-labelledby="pilares-sobre">
          <h2 id="pilares-sobre">O que nos guia</h2>
          <RevealStagger className="pilares pilares--claro">
            {PILARES.map((p, i) => (
              <RevealItem key={p.titulo} className="pilar">
                <p className="pilar-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </RevealItem>
            ))}
          </RevealStagger>
        </section>
      </div>
    </>
  );
}
