/**
 * Sacola no navegador, sem framework. Guarda só `{variantId, qty}[]` (e o
 * preço visto, para avisar se mudou); nome e preço vêm sempre do catálogo
 * atual. Regras em admin/docs/comportamentos/loja.md (CAR-*).
 * Kit 1.0.0-pre. Copie, não importe (→ src/lib/loja do site).
 */
import type { Catalogo, Linha } from "./types";

export const QTD_MAXIMA = 99;
export const LINHAS_MAXIMAS = 50;
export const EXPIRA_MS = 30 * 24 * 60 * 60 * 1000;
export const VERSAO_CHAVE = "v1";

export const chaveCarrinho = (tenant: string) => `cc-loja:${tenant}:carrinho:${VERSAO_CHAVE}`;

export type VarianteResumo = {
  id: string;
  produto: string;
  slug: string;
  nome: string;
  priceCents: number;
  available: boolean;
  maxQty: number;
};

export type Aviso = { variantId: string; tipo: "removed" | "qty_reduced" | "price_changed"; nome: string };

export type LinhaCompleta = Linha & { variante: VarianteResumo; lineCents: number };

export type Snapshot = {
  linhas: LinhaCompleta[];
  quantidade: number;
  subtotalCents: number;
  avisos: Aviso[];
  /** false até ler o localStorage (sempre false no servidor). */
  pronto: boolean;
};

export type Guardado = { lines: Linha[]; precos: Record<string, number>; updatedAt: number };

type Armazenamento = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type Alvo = Pick<EventTarget, "addEventListener" | "removeEventListener" | "dispatchEvent">;

export function resumirCatalogo(c: Catalogo): VarianteResumo[] {
  return c.products.flatMap((p) =>
    p.variants.map((v) => ({
      id: v.id,
      produto: p.name,
      slug: p.slug,
      nome: v.name,
      priceCents: v.priceCents,
      available: v.available,
      maxQty: v.maxQty,
    })),
  );
}

const rotulo = (v: VarianteResumo | undefined) => (v ? `${v.produto} — ${v.nome}` : "Um item");

/** Mescla repetidas, tira o que sumiu, limita qty a 1…maxQty e diz o que mudou. */
export function reconciliar(
  entrada: Linha[],
  porId: Map<string, VarianteResumo>,
  precosVistos: Record<string, number> = {},
): { linhas: Linha[]; avisos: Aviso[] } {
  const avisos: Aviso[] = [];
  const somadas = new Map<string, number>();
  for (const l of entrada) {
    if (typeof l?.variantId !== "string" || !Number.isFinite(l.qty)) continue;
    somadas.set(l.variantId, (somadas.get(l.variantId) ?? 0) + Math.trunc(l.qty));
  }
  const linhas: Linha[] = [];
  for (const [variantId, qty] of somadas) {
    if (qty <= 0) continue;
    const v = porId.get(variantId);
    if (!v || !v.available || v.maxQty < 1) {
      avisos.push({ variantId, tipo: "removed", nome: rotulo(v) });
      continue;
    }
    const limite = Math.min(v.maxQty, QTD_MAXIMA);
    if (qty > limite) avisos.push({ variantId, tipo: "qty_reduced", nome: rotulo(v) });
    const visto = precosVistos[variantId];
    if (visto !== undefined && visto !== v.priceCents) {
      avisos.push({ variantId, tipo: "price_changed", nome: rotulo(v) });
    }
    linhas.push({ variantId, qty: Math.min(qty, limite) });
  }
  return { linhas: linhas.slice(0, LINHAS_MAXIMAS), avisos };
}

/** Lê o que está guardado. JSON quebrado, formato estranho ou sacola vencida → null. */
export function lerGuardado(bruto: string | null, agora: number): Guardado | null {
  if (!bruto) return null;
  let g: unknown;
  try {
    g = JSON.parse(bruto);
  } catch {
    return null;
  }
  if (!g || typeof g !== "object") return null;
  const { lines, precos, updatedAt } = g as Partial<Guardado>;
  if (!Array.isArray(lines) || typeof updatedAt !== "number") return null;
  if (agora - updatedAt > EXPIRA_MS) return null;
  return { lines, precos: precos && typeof precos === "object" ? precos : {}, updatedAt };
}

export function criarCarrinho({
  tenant,
  variantes,
  armazenamento = globalThis.localStorage,
  alvo = globalThis.window,
  agora = Date.now,
}: {
  tenant: string;
  variantes: VarianteResumo[];
  armazenamento?: Armazenamento;
  alvo?: Alvo;
  agora?: () => number;
}) {
  const chave = chaveCarrinho(tenant);
  let porId = new Map(variantes.map((v) => [v.id, v]));
  const ouvintes = new Set<() => void>();
  let lines: Linha[] = [];
  let avisos: Aviso[] = [];
  let pronto = false;
  const vazio: Snapshot = { linhas: [], quantidade: 0, subtotalCents: 0, avisos: [], pronto: false };
  let snapshot: Snapshot = vazio;

  function montar(): Snapshot {
    const linhas = lines.flatMap((l) => {
      const v = porId.get(l.variantId);
      return v ? [{ ...l, variante: v, lineCents: v.priceCents * l.qty }] : [];
    });
    return {
      linhas,
      quantidade: linhas.reduce((s, l) => s + l.qty, 0),
      subtotalCents: linhas.reduce((s, l) => s + l.lineCents, 0),
      avisos,
      pronto,
    };
  }

  function emitir() {
    snapshot = montar();
    ouvintes.forEach((f) => f());
  }

  const precosAtuais = () => Object.fromEntries(lines.map((l) => [l.variantId, porId.get(l.variantId)!.priceCents]));

  function gravar() {
    try {
      if (!lines.length) armazenamento?.removeItem(chave);
      else {
        const g: Guardado = { lines, precos: precosAtuais(), updatedAt: agora() };
        armazenamento?.setItem(chave, JSON.stringify(g));
      }
    } catch {
      // cota cheia ou modo privado: a sacola segue só na memória
    }
  }

  function carregar() {
    let bruto: string | null = null;
    try {
      bruto = armazenamento?.getItem(chave) ?? null;
    } catch {}
    const g = lerGuardado(bruto, agora());
    const r = reconciliar(g?.lines ?? [], porId, g?.precos ?? {});
    lines = r.linhas;
    avisos = r.avisos;
    pronto = true;
    if (!g && bruto) gravar(); // limpa o que estava vencido ou quebrado
    emitir();
  }

  function mudar(proximas: Linha[]) {
    const r = reconciliar(proximas, porId);
    lines = r.linhas;
    avisos = r.avisos;
    gravar();
    emitir();
  }

  function aoStorage(e: Event) {
    if ((e as StorageEvent).key === chave) carregar();
  }

  return {
    /** Chame depois da hidratação. Devolve a limpeza. */
    iniciar() {
      carregar();
      alvo?.addEventListener("storage", aoStorage);
      return () => alvo?.removeEventListener("storage", aoStorage);
    },
    subscribe(f: () => void) {
      ouvintes.add(f);
      return () => {
        ouvintes.delete(f);
      };
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => vazio,
    /** false quando a sacola já tem 50 itens diferentes. */
    adicionar(variantId: string, qty = 1): boolean {
      const atual = lines.find((l) => l.variantId === variantId);
      if (!atual && lines.length >= LINHAS_MAXIMAS) return false;
      mudar(atual ? lines.map((l) => (l === atual ? { variantId, qty: l.qty + qty } : l)) : [...lines, { variantId, qty }]);
      alvo?.dispatchEvent(new CustomEvent("carrinho:adicionar", { detail: { variantId, qty } }));
      return true;
    },
    definirQtd(variantId: string, qty: number) {
      mudar(lines.map((l) => (l.variantId === variantId ? { variantId, qty } : l)));
    },
    remover(variantId: string) {
      mudar(lines.filter((l) => l.variantId !== variantId));
    },
    limpar() {
      mudar([]);
    },
    /** Catálogo novo (revalidação): reconcilia e avisa o que mudou. */
    trocarCatalogo(novas: VarianteResumo[]) {
      const vistos = precosAtuais();
      porId = new Map(novas.map((v) => [v.id, v]));
      const r = reconciliar(lines, porId, vistos);
      lines = r.linhas;
      avisos = r.avisos;
      gravar();
      emitir();
    },
    dispensarAvisos() {
      avisos = [];
      emitir();
    },
    variante: (id: string) => porId.get(id),
  };
}

export type Carrinho = ReturnType<typeof criarCarrinho>;
