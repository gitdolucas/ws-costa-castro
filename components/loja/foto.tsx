import type { Imagem } from "@/lib/loja/types";
import { Ramo } from "@/components/ornamentos";

/**
 * Foto do produto. Sem URL: amostra de tecido com selo [FOTO REAL] visível,
 * nunca imagem gerada no lugar do produto.
 */
export function FotoProduto({
  imagem,
  tom = "folha",
  priority = false,
  className,
}: {
  imagem?: Imagem;
  tom?: "folha" | "caqui" | "oliva";
  priority?: boolean;
  className?: string;
}) {
  if (imagem) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imagem.url}
        alt={imagem.alt}
        width={imagem.width}
        height={imagem.height}
        loading={priority ? "eager" : "lazy"}
        className={`foto ${className ?? ""}`}
      />
    );
  }
  return (
    <div className={`foto foto-provisoria tom-${tom} ${className ?? ""}`} role="img" aria-label="Foto do produto (foto provisória)">
      <Ramo className="foto-ramo" />
      <span className="selo-provisorio">[FOTO REAL]</span>
    </div>
  );
}
