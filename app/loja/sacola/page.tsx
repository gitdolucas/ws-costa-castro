import type { Metadata } from "next";
import { getCatalogo } from "@/lib/loja/api";
import { Sacola } from "@/components/loja/sacola";

export const metadata: Metadata = { title: "Sacola", robots: { index: false } };

export default async function PaginaSacola() {
  const catalogo = await getCatalogo();
  return (
    <div className="pagina-sacola">
      <header className="loja-cabeca">
        <p className="rotulo">Quase lá</p>
        <h1>
          Sua <em>sacola</em>
        </h1>
      </header>
      <Sacola campos={catalogo.loja.checkoutFields} notaFrete={catalogo.loja.shippingNote} />
    </div>
  );
}
