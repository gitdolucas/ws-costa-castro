import { FaixaPalavras } from "@/components/faixa-palavras";
import { HeroCamadas } from "@/components/hero-camadas";
import { CtaButton } from "@/components/motion/cta-button";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import { Ramo } from "@/components/ornamentos";
import { SecaoInstagram } from "@/components/secao-instagram";
import { VitrineEditorial } from "@/components/vitrine-editorial";
import { FAIXA_PALAVRAS, HERO_IMAGEM_BLOB } from "@/lib/content/hero";
import { PILARES } from "@/lib/content/institucional";
import { VITRINE } from "@/lib/content/vitrine";
import { resolveMediaUrl } from "@/lib/media";
import { CIDADES_ATENDIMENTO, whatsappUrl } from "@/lib/site";

export default function Inicio() {
  const cidades = CIDADES_ATENDIMENTO.join(" e ");

  return (
    <>
      <HeroCamadas
        imagemSrc={resolveMediaUrl(HERO_IMAGEM_BLOB)}
        imagemAlt="Kit de cama em algodão, estampa botânica — curadoria Costa Castro"
        subtitulo={`${cidades}`}
        titulo={
          <>
            Conforto em <em>camadas</em>, do tecido ao lar.
          </>
        }
        lead="Curadoria de cama, banho, linha baby e bordados personalizados. Disponibilidade e combinações pelo WhatsApp."
      />

      <FaixaPalavras palavras={FAIXA_PALAVRAS} />

      <div className="conteudo-site">
        <section id="vitrine" className="secao secao-vitrine" aria-labelledby="titulo-vitrine">
          <Reveal>
            <header className="secao-cabeca secao-cabeca--linha">
              <p className="rotulo">Vitrine</p>
              <h2 id="titulo-vitrine">
                Quatro <em>linhas</em>, uma casa.
              </h2>
              <p className="nota secao-cabeca-nota">Peças em destaque — valores e estoque confirmados no atendimento.</p>
            </header>
          </Reveal>
          <VitrineEditorial itens={VITRINE} />
        </section>
      </div>

      <section className="bloco-escuro" aria-labelledby="titulo-confianca">
        <div className="conteudo-site bloco-escuro-grade">
          <Reveal className="bloco-escuro-cabeca">
            <p className="rotulo rotulo--claro">Por que a Costa Castro</p>
            <h2 id="titulo-confianca">
              Quem conhece o <em>tecido</em> atende você.
            </h2>
          </Reveal>
          <RevealStagger className="pilares">
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
        </div>
      </section>

      <div className="conteudo-site">
        <SecaoInstagram />

        <section className="secao chamada" aria-labelledby="titulo-contato-rapido">
          <Ramo className="chamada-ramo" />
          <Reveal className="chamada-corpo">
            <p className="rotulo">Atendimento em {cidades}</p>
            <h2 id="titulo-contato-rapido">
              Pronto para montar
              <br />o seu <em>enxoval</em>?
            </h2>
            <div className="hero-acoes">
              <CtaButton href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                Falar com a Costa Castro
              </CtaButton>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}
