import type { Metadata } from "next";
import { CabecaInterna } from "@/components/cabeca-interna";
import { Sacola } from "@/components/loja/sacola";
import { resumirCatalogo } from "@/lib/loja/carrinho";
import { CarrinhoProvider } from "@/lib/loja/ganchos";
import { getCatalogo } from "@/lib/loja/api";

export const metadata: Metadata = {
  title: "Sacola",
  description: "Sua sacola de compras — confira as peças e finalize pelo WhatsApp.",
};

export default async function SacolaPage() {
  const catalogo = await getCatalogo();
  const { loja } = catalogo;
  const variantes = resumirCatalogo(catalogo);

  return (
    <>
      <CabecaInterna rotulo="Loja" titulo="Sua sacola" />
      <div className="conteudo-site">
        <CarrinhoProvider tenant={loja.slug} variantes={variantes} locale={loja.locale} currency={loja.currency}>
          <Sacola campos={loja.checkoutFields} notaFrete={loja.shippingNote} />
        </CarrinhoProvider>
      </div>
    </>
  );
}
