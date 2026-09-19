"use client";

/**
 * Ligação React da sacola: provider + hooks sobre useSyncExternalStore.
 * Igual em todo site. Kit 1.0.0-pre. Copie, não importe (→ src/lib/loja).
 */
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { criarCarrinho, type Carrinho, type VarianteResumo } from "./carrinho";
import { formatarDinheiro } from "./dinheiro";

type Ctx = { carrinho: Carrinho; locale: string; currency: string };
const Contexto = createContext<Ctx | null>(null);

export function CarrinhoProvider({
  tenant,
  variantes,
  locale = "pt-BR",
  currency = "BRL",
  children,
}: {
  tenant: string;
  variantes: VarianteResumo[];
  locale?: string;
  currency?: string;
  children: React.ReactNode;
}) {
  const [carrinho] = useState(() => criarCarrinho({ tenant, variantes }));
  useEffect(() => carrinho.iniciar(), [carrinho]);
  // Catálogo revalidado chega como props novas: reconcilia e avisa.
  const primeiras = useRef(variantes);
  useEffect(() => {
    if (variantes !== primeiras.current) carrinho.trocarCatalogo(variantes);
  }, [carrinho, variantes]);
  return <Contexto.Provider value={{ carrinho, locale, currency }}>{children}</Contexto.Provider>;
}

function useCtx() {
  const c = useContext(Contexto);
  if (!c) throw new Error("Use dentro de <CarrinhoProvider>");
  return c;
}

export function useCarrinho() {
  const { carrinho } = useCtx();
  const snap = useSyncExternalStore(carrinho.subscribe, carrinho.getSnapshot, carrinho.getServerSnapshot);
  return {
    ...snap,
    adicionar: carrinho.adicionar,
    definirQtd: carrinho.definirQtd,
    remover: carrinho.remover,
    limpar: carrinho.limpar,
    dispensarAvisos: carrinho.dispensarAvisos,
    variante: carrinho.variante,
  };
}

export function useDinheiro() {
  const { locale, currency } = useCtx();
  return (cents: number) => formatarDinheiro(cents, locale, currency);
}
