/** Dinheiro do tenant: centavos inteiros → texto no locale e moeda da loja. Kit 1.0.0-pre. */
const formatos = new Map<string, Intl.NumberFormat>();

export function formatarDinheiro(cents: number, locale = "pt-BR", currency = "BRL") {
  const chave = `${locale}|${currency}`;
  let f = formatos.get(chave);
  if (!f) formatos.set(chave, (f = new Intl.NumberFormat(locale, { style: "currency", currency })));
  return f.format(cents / 100);
}
