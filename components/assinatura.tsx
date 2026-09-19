import type { CSSProperties } from "react";
import { Selo, type SeloCores } from "@/components/selo";

/**
 * Assinatura de rodapé — padrão de todos os sites da Cara Certa.
 *
 * Carimbo pequeno + título e subtítulo à direita. A arte vem de <Selo
 * recorte="icone" />. O que muda é a tipografia e, acima de tudo, a COR
 * DO TEXTO: ela é informada por quem usa, porque a assinatura entra em
 * fundos diferentes e o contraste tem que ser decidido lá, não aqui.
 *
 *   <SeloAssinatura
 *     cor="#fff"
 *     corSub="rgba(255,255,255,.6)"
 *     cliente="freios-do-vale"
 *   />
 *
 * O carimbo é sempre lima (papel branco, painel #dfff4f), como no
 * rodapé da agência. Não use o coral da arte original.
 *
 * Fonte da verdade: componentes/assinatura.tsx — copie, não importe.
 */

type CssVar = CSSProperties & Record<`--${string}`, string>;

export type SeloAssinaturaProps = {
  /** Cor do título. Informe a de máximo contraste no fundo onde entra. */
  cor: string;
  /** Cor do subtítulo. Padrão: a mesma do título. */
  corSub?: string;
  /** Largura do carimbo em px. */
  size?: number;
  titulo?: string;
  subtitulo?: string;
  /** Destino do link. Padrão: site da agência. */
  href?: string;
  /** Slug do cliente — vira utm_campaign. */
  cliente?: string;
  /** Acrescenta os parâmetros utm_*. Padrão: true. */
  utm?: boolean;
  /** Abre em nova aba. Padrão: true. */
  novaAba?: boolean;
  /** Cores da arte do carimbo. A base é lima; isto só sobrescreve camadas. */
  cores?: Partial<SeloCores>;
  className?: string;
};

const SITE_AGENCIA = "https://www.cara-certa.com.br";
const MARCA = "Cara Certa";

function TituloMarcado({ titulo }: { titulo: string }) {
  const i = titulo.indexOf(MARCA);
  if (i < 0) return titulo;
  return (
    <>
      {titulo.slice(0, i)}
      <em>{MARCA}</em>
      {titulo.slice(i + MARCA.length)}
    </>
  );
}

/** Paleta do carimbo em todo site — a mesma do rodapé da agência. */
export const CORES_SELO_LIMA: Readonly<SeloCores> = {
  papel: "#FFFFFF",
  coral: "#dfff4f",
  branco: "#FFFFFF",
  tinta: "#100C0C",
  texto: "#100C0C",
};

const CSS = `
.selo-assin a{
  display:inline-flex;align-items:center;gap:10px;text-decoration:none;
  color:var(--selo-cor);border:0;box-shadow:none;border-radius:8px;
  -webkit-tap-highlight-color:transparent}
.selo-assin .selo-svg{
  transform-origin:50% 60%;transition:transform .35s cubic-bezier(.2,.9,.25,1.1)}
.selo-assin a:hover .selo-svg,.selo-assin a:focus-visible .selo-svg{
  transform:rotate(-3.5deg) translateY(-2px) scale(1.04)}
.selo-assin-txt{font-size:14px;line-height:1.3;letter-spacing:-.01em}
.selo-assin-txt strong{display:block;font-weight:600;color:var(--selo-cor)}
.selo-assin-txt em{font-style:normal;font-weight:inherit}
.selo-assin a:hover .selo-assin-txt em{text-decoration:underline;text-underline-offset:.18em}
.selo-assin-txt span{
  display:block;margin-top:2px;font-size:12px;font-weight:400;
  letter-spacing:0;opacity:1;color:var(--selo-cor-sub)}
.selo-assin a:focus-visible{outline:2px solid currentColor;outline-offset:4px}
@media (prefers-reduced-motion:reduce){
  .selo-assin .selo-svg{transition:none}
  .selo-assin a:hover .selo-svg,.selo-assin a:focus-visible .selo-svg{transform:none}
}`;

export function SeloAssinatura({
  cor,
  corSub = cor,
  size = 32,
  titulo = "Site criado pela Cara Certa",
  subtitulo = "Websites de qualidade.",
  href = SITE_AGENCIA,
  cliente,
  utm = true,
  novaAba = true,
  cores,
  className,
}: SeloAssinaturaProps) {
  const destino = utm
    ? `${href}${href.includes("?") ? "&" : "?"}utm_source=selo&utm_medium=rodape${
        cliente ? `&utm_campaign=${encodeURIComponent(cliente)}` : ""
      }`
    : href;

  return (
    <span
      className={className ? `selo-assin ${className}` : "selo-assin"}
      style={{ "--selo-cor": cor, "--selo-cor-sub": corSub } as CssVar}
    >
      <style href="assinatura" precedence="medium">
        {CSS}
      </style>
      <a
        href={destino}
        aria-label={`${titulo} — ${subtitulo}`}
        {...(novaAba ? { target: "_blank", rel: "noopener" } : null)}
      >
        <Selo recorte="icone" size={size} cores={{ ...CORES_SELO_LIMA, ...cores }} />
        <span className="selo-assin-txt">
          <strong>
            <TituloMarcado titulo={titulo} />
          </strong>
          <span>{subtitulo}</span>
        </span>
      </a>
    </span>
  );
}

export default SeloAssinatura;
