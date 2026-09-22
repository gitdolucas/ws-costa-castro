import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Cabecalho, Rodape } from "@/components/moldura";
import { jsonLdOrganization } from "@/lib/jsonld";
import { SITE, SITE_INDEXAVEL, TAGLINE } from "@/lib/site";

// Fontes vendorizadas (subset latin, variáveis) — build offline, sem chamada ao Google em CI/sandbox.
const titulo = localFont({
  src: [
    { path: "./fonts/CormorantGaramond-variable.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/CormorantGaramond-variable-italic.woff2", weight: "300 700", style: "italic" },
  ],
  display: "swap",
  variable: "--fonte-titulo",
  fallback: ["Georgia", "serif"],
});
const texto = localFont({
  src: [{ path: "./fonts/Jost-variable.woff2", weight: "100 900", style: "normal" }],
  display: "swap",
  variable: "--fonte-texto",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Costa Castro | Cama, mesa e banho", template: "%s | Costa Castro" },
  description: TAGLINE,
  robots: SITE_INDEXAVEL ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Costa Castro",
    title: "Costa Castro",
    description: TAGLINE,
  },
  twitter: {
    card: "summary_large_image",
    title: "Costa Castro",
    description: TAGLINE,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJson = jsonLdOrganization();

  return (
    <html lang="pt-BR" className={`${titulo.variable} ${texto.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJson) }} />
      </head>
      <body>
        <MotionProvider>
          <a href="#conteudo" className="pular">
            Pular para o conteúdo
          </a>
          <Cabecalho />
          <main id="conteudo">{children}</main>
          <Rodape />
        </MotionProvider>
      </body>
    </html>
  );
}
