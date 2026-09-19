import Link from "next/link";
import { SeloAssinatura } from "@/components/assinatura";
import { ContagemSacola } from "@/components/contagem-sacola";
import { whatsappUrl } from "@/lib/site";
import { Ramo } from "@/components/ornamentos";

export function AvisoPiloto() {
  return (
    <p className="aviso-piloto">
      Protótipo interno · catálogo, preços e fotos provisórios
    </p>
  );
}

export function Cabecalho() {
  return (
    <header className="cabecalho">
      <Link href="/" className="marca" aria-label="Costa Castro, início">
        <span className="marca-nome">Costa Castro</span>
        <span className="marca-sub">cama · mesa · banho</span>
      </Link>
      <nav className="menu" aria-label="Principal">
        <Link href="/loja/categoria/cama">Cama</Link>
        <Link href="/loja/categoria/mesa">Mesa</Link>
        <Link href="/loja/categoria/banho">Banho</Link>
      </nav>
      <Link href="/loja/sacola" className="sacola-link">
        Sacola <ContagemSacola />
      </Link>
    </header>
  );
}

export function Rodape() {
  return (
    <footer className="rodape">
      <Ramo className="rodape-ramo" />
      <div className="rodape-grade">
        <div>
          <p className="rodape-marca">Costa Castro</p>
          <p>Cama, mesa e banho em algodão egípcio. Niterói, RJ.</p>
        </div>
        <div>
          <p className="rotulo">Visite a loja</p>
          <p>[ENDEREÇO] · Niterói, RJ</p>
          <p>[HORÁRIO]</p>
        </div>
        <div>
          <p className="rotulo">Atendimento</p>
          <a href={whatsappUrl()} target="_blank" rel="noopener" className="link-forte">
            Falar no WhatsApp
          </a>
        </div>
      </div>
      <div className="rodape-assinatura">
        <SeloAssinatura cor="#2E3127" corSub="rgba(46,49,39,.62)" cliente="costa-castro" />
      </div>
    </footer>
  );
}
