import Link from "next/link";
import { getCatalogo } from "@/lib/loja/api";
import { Vitrine } from "@/components/loja/vitrine";
import { DESCRICAO_SECAO } from "@/lib/secoes";
import { Ramo, Folha } from "@/components/ornamentos";
import { whatsappUrl } from "@/lib/site";
import { Abertura } from "@/components/abertura";

const materia = [
  ["Fibra", "100% algodão egípcio"],
  ["Toque", "Macio, respirável, fresco no verão"],
  ["Costura", "Pesponto fino, acabamento limpo"],
  ["Detalhe", "Bordado artesanal"],
  ["Conjunto", "Lençol, fronhas e cobreleito coordenados"],
];

export default async function Inicio() {
  const catalogo = await getCatalogo();
  const destaques = catalogo.products.filter((p) => p.tags.includes("destaque") || p.categoryIds.includes("cat_cama")).slice(0, 3);

  return (
    <>
      <Abertura />
      <section className="hero">
        <div className="hero-texto">
          <p className="rotulo">Niterói · cama, mesa e banho</p>
          <h1>
            Leveza para os seus <em>dias de descanso</em>.
          </h1>
          <p className="hero-sub">
            Peças em 100% algodão egípcio, com bordado artesanal e jogos pensados para combinar entre si.
          </p>
          <div className="hero-acoes">
            <Link href="/loja" className="botao botao-primario">
              Ver a coleção
            </Link>
            <a href={whatsappUrl()} target="_blank" rel="noopener" className="botao botao-secundario">
              Falar no WhatsApp
            </a>
          </div>
        </div>
        <Ramo className="hero-ramo" desenhar />
      </section>

      <section className="secao" aria-labelledby="titulo-colecao">
        <header className="secao-cabeca">
          <p className="rotulo">Coleção Folhagem</p>
          <h2 id="titulo-colecao">A cama como um refúgio.</h2>
          <Link href="/loja/categoria/cama" className="link-forte">
            Ver tudo de cama
          </Link>
        </header>
        <Vitrine catalogo={catalogo} produtos={destaques} />
      </section>

      <section className="secao materia" aria-labelledby="titulo-materia">
        <div className="materia-intro">
          <Folha className="materia-folha" />
          <h2 id="titulo-materia">
            O que se sente <em>antes</em> de se ver.
          </h2>
          <p>Frescor e suavidade vêm da fibra e do acabamento. É por isso que cada peça começa pelo algodão.</p>
        </div>
        <dl className="ficha-tecnica">
          {materia.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="secao portas" aria-label="Seções da loja">
        {catalogo.categories
          .filter((c) => !c.slug.startsWith("colecao-"))
          .map((c, i) => (
          <Link key={c.id} href={`/loja/categoria/${c.slug}`} className={`porta porta-${i + 1}`}>
            <span className="porta-nome">{c.name}</span>
            <span className="porta-desc">{DESCRICAO_SECAO[c.slug]}</span>
          </Link>
        ))}
      </section>

      <section className="secao visita" aria-labelledby="titulo-visita">
        <h2 id="titulo-visita">Toque o tecido antes de levar.</h2>
        <p>
          Visite a loja em Niterói ou monte a sua sacola aqui e finalize pelo WhatsApp. A loja confirma peças, frete e
          pagamento na conversa.
        </p>
        <div className="hero-acoes">
          <Link href="/loja" className="botao botao-primario">
            Montar minha sacola
          </Link>
          <a href={whatsappUrl()} target="_blank" rel="noopener" className="botao botao-secundario">
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
