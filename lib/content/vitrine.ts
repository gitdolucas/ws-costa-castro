import type { WhatsAppContext } from "@/lib/content/types";

export type ItemVitrine = {
  id: string;
  titulo: string;
  descricao: string;
  linha: "cama" | "banho" | "baby" | "bordados";
  blobImage?: string | null;
  contextoWhatsapp: WhatsAppContext;
};

/** Curadoria editorial v1 — sem preço, estoque ou SKU. */
export const VITRINE: ItemVitrine[] = [
  {
    id: "kit-floral",
    titulo: "Cama em algodão, estampa natural",
    descricao: "Jogos e kits coordenados para quem busca maciez e visual sereno no quarto.",
    linha: "cama",
    blobImage: "01-cama-karsten-floral.jpg",
    contextoWhatsapp: "vitrine cama — kit floral",
  },
  {
    id: "toalha-plaza",
    titulo: "Banho de toque macio",
    descricao: "Toalhas em algodão com acabamento pensado para o dia a dia e para presentear.",
    linha: "banho",
    blobImage: "08-banho-karsten-plaza.jpg",
    contextoWhatsapp: "vitrine banho",
  },
  {
    id: "linha-baby",
    titulo: "Linha baby e presentes",
    descricao: "Peças delicadas para enxoval infantil, com possibilidade de personalização.",
    linha: "baby",
    blobImage: "10-baby-dohler.jpg",
    contextoWhatsapp: "vitrine baby",
  },
  {
    id: "bordados",
    titulo: "Bordados personalizados",
    descricao: "Monogramas e detalhes bordados para toalhas, enxovais e presentes corporativos.",
    linha: "bordados",
    blobImage: "06-cama-karsten-elisa.jpg",
    contextoWhatsapp: "serviço bordados",
  },
];
