"use client";

import { MediaFrame } from "@/components/media-frame";
import { CtaButton } from "@/components/motion/cta-button";
import { RevealItem, RevealStagger } from "@/components/motion/reveal";
import type { ItemVitrine } from "@/lib/content/vitrine";
import { whatsappUrlComContexto } from "@/lib/site";

const LINHA_LABEL: Record<ItemVitrine["linha"], string> = {
  cama: "Cama",
  banho: "Banho",
  baby: "Baby",
  bordados: "Bordados",
};

export function VitrineEditorialClient({ itens }: { itens: ItemVitrine[] }) {
  return (
    <RevealStagger className="capitulos">
      {itens.map((item, i) => {
        const num = String(i + 1).padStart(2, "0");
        return (
          <RevealItem key={item.id} className={`capitulo capitulo--${i % 2 === 0 ? "a" : "b"}`}>
            <article className="capitulo-grade">
              <p className="capitulo-num" aria-hidden="true">
                {num}
              </p>

              <div className="capitulo-media">
                <MediaFrame blobImage={item.blobImage} alt={item.titulo} className="capitulo-foto" />
                <span className="etiqueta capitulo-etiqueta" aria-hidden="true">
                  <span className="etiqueta-cat">{LINHA_LABEL[item.linha]}</span>
                  <span className="etiqueta-nome">{num}</span>
                </span>
              </div>

              <div className="capitulo-corpo">
                <p className="rotulo capitulo-linha">{LINHA_LABEL[item.linha]}</p>
                <h3 className="capitulo-titulo">{item.titulo}</h3>
                <p className="capitulo-desc">{item.descricao}</p>
                <CtaButton
                  href={whatsappUrlComContexto(item.contextoWhatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secundario"
                >
                  Consultar no WhatsApp
                </CtaButton>
              </div>
            </article>
          </RevealItem>
        );
      })}
    </RevealStagger>
  );
}
