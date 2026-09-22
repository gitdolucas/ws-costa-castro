import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { PILARES, SOBRE_LEAD } from "@/lib/content/institucional";
import { CIDADES_ATENDIMENTO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description: SOBRE_LEAD,
};

export default function SobrePage() {
  const cidades = CIDADES_ATENDIMENTO.join(" e ");

  return (
    <article className="secao pagina-interna">
      <Reveal>
        <h1>Sobre a Costa Castro</h1>
        <p className="lead">{SOBRE_LEAD}</p>
        <p>
          Atendemos em {cidades} com loja física, direct e WhatsApp. Nossa curadoria privilegia tecidos de qualidade,
          coordenação entre peças e o cuidado nos detalhes — incluindo bordados personalizados para presentes e enxovais.
        </p>
      </Reveal>
      <section aria-labelledby="pilares-sobre">
        <h2 id="pilares-sobre">O que nos guia</h2>
        <ul className="pilares-lista">
          {PILARES.map((p) => (
            <li key={p.titulo}>
              <Reveal>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
