import type { Metadata } from "next";
import { CabecaInterna } from "@/components/cabeca-interna";
import { CtaButton } from "@/components/motion/cta-button";
import { Reveal } from "@/components/motion/reveal";
import { CIDADES_ATENDIMENTO, INSTAGRAM_URL, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Costa Castro pelo WhatsApp ou Instagram. Atendimento em Niterói e Maricá.",
};

export default function ContatoPage() {
  const cidades = CIDADES_ATENDIMENTO.join(" e ");

  return (
    <>
      <CabecaInterna
        rotulo="Contato"
        titulo="Contato"
        lead={`Estamos em ${cidades}. Endereço e horário de cada unidade são confirmados na conversa.`}
      />
      <div className="conteudo-site">
        <section className="secao">
          <div className="contato-grade">
            <Reveal>
              <h2>WhatsApp</h2>
              <p className="contato-numero">+55 21 98458-8952</p>
              <CtaButton href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                Abrir conversa no WhatsApp
              </CtaButton>
            </Reveal>
            <Reveal>
              <h2>Instagram</h2>
              <p>Novidades, combinações e inspirações para o lar.</p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="link-forte">
                @costacastroloja
              </a>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
