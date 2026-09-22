type Props = {
  rotulo: string;
  titulo: string;
  lead?: string;
};

/** Cabeçalho editorial compartilhado pelas páginas internas (Sobre, Contato, Loja). */
export function CabecaInterna({ rotulo, titulo, lead }: Props) {
  return (
    <div className="conteudo-site">
      <header className="secao-cabeca secao-cabeca--linha cabeca-interna">
        <p className="rotulo">{rotulo}</p>
        <h1 className="cabeca-interna-titulo">{titulo}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </header>
    </div>
  );
}
