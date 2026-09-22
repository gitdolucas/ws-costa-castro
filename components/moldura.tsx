import Link from "next/link";
import { SeloAssinatura } from "@/components/assinatura";
import { CIDADES_ATENDIMENTO, INSTAGRAM_URL, TAGLINE, whatsappUrl } from "@/lib/site";
import { Ramo } from "@/components/ornamentos";

export function Cabecalho() {
  return (
    <div className="cabecalho-fixo">
      <header className="cabecalho">
        <Link href="/" className="marca" aria-label="Costa Castro, início">
          <span className="marca-nome">Costa Castro</span>
          <span className="marca-sub">cama · mesa · banho</span>
        </Link>
        <nav className="menu" aria-label="Principal">
          <Link href="/#vitrine">Vitrine</Link>
          <Link href="/loja">Loja</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/contato">Contato</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </nav>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="cabecalho-whatsapp link-forte">
          WhatsApp
        </a>
      </header>
    </div>
  );
}

export function Rodape() {
  const cidades = CIDADES_ATENDIMENTO.join(" e ");

  return (
    <footer className="rodape">
      <Ramo className="rodape-ramo" />
      <div className="rodape-grade">
        <div>
          <p className="rodape-marca">Costa Castro</p>
          <p>{TAGLINE}</p>
        </div>
        <div>
          <p className="nota">Atendimento em {cidades}. Endereço e horário confirmados no WhatsApp.</p>
        </div>
        <div>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="link-forte">
            Falar com a Costa Castro
          </a>
          <p className="nota">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="link">
              Instagram
            </a>
          </p>
        </div>
      </div>
      <div className="rodape-assinatura">
        <SeloAssinatura cor="#2E3127" corSub="rgba(46,49,39,.62)" cliente="costa-castro" />
      </div>
    </footer>
  );
}
