import type { Metadata } from "next";
import { getCatalogo } from "@/lib/loja/api";
import { FiltroCategorias, Vitrine } from "@/components/loja/vitrine";

export const metadata: Metadata = {
  title: "Coleção",
  description: "Jogos de cama, mesa e banho em algodão egípcio. Monte a sacola e finalize pelo WhatsApp.",
};

export default async function Loja() {
  const catalogo = await getCatalogo();
  return (
    <div className="pagina-loja">
      <header className="loja-cabeca">
        <p className="rotulo">A coleção</p>
        <h1>
          Cama, mesa <em>e banho</em>
        </h1>
        <FiltroCategorias catalogo={catalogo} />
      </header>
      <Vitrine catalogo={catalogo} />
    </div>
  );
}
