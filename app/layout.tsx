import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { getCatalogo } from "@/lib/loja/api";
import { resumirCatalogo } from "@/lib/loja/carrinho";
import { CarrinhoProvider } from "@/lib/loja/ganchos";
import { AvisoPiloto, Cabecalho, Rodape } from "@/components/moldura";

/** Serifa de etiqueta de enxoval nos títulos; Jost discreta na informação técnica. */
const titulo = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--fonte-titulo",
});
const texto = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--fonte-texto",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Costa Castro | Cama, mesa e banho em Niterói", template: "%s | Costa Castro" },
  description: "Cama, mesa e banho em 100% algodão egípcio, com bordado artesanal e jogos coordenados. Niterói, RJ.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalogo = await getCatalogo();
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${texto.variable}`}>
      <body>
        <a href="#conteudo" className="pular">
          Pular para o conteúdo
        </a>
        <CarrinhoProvider
          tenant={catalogo.loja.slug}
          variantes={resumirCatalogo(catalogo)}
          locale={catalogo.loja.locale}
          currency={catalogo.loja.currency}
        >
          <AvisoPiloto />
          <Cabecalho />
          <main id="conteudo">{children}</main>
          <Rodape />
        </CarrinhoProvider>
      </body>
    </html>
  );
}
