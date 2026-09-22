/** Faixa em movimento contínuo (CSS-only). Duplicada para loop sem costura; pausa com reduced-motion. */
export function FaixaPalavras({ palavras }: { palavras: readonly string[] }) {
  const trilho = [...palavras, ...palavras];

  return (
    <div className="faixa" aria-hidden="true">
      <div className="faixa-trilho">
        {trilho.map((p, i) => (
          <span key={`${p}-${i}`} className="faixa-item">
            <em>{p}</em>
            <span className="faixa-ponto" />
          </span>
        ))}
      </div>
    </div>
  );
}
