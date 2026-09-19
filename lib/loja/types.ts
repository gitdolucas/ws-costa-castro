/**
 * Tipos do kit Loja — espelho à mão de `admin/src/lib/loja/schema.ts`.
 * O site não leva zod: estes tipos bastam. O teste KITL-001 do admin
 * falha se divergirem do schema. Kit 1.0.0-pre, API /v1.
 * Copie, não importe (admin/src/kit/loja → src/lib/loja do site).
 */

export type CampoCheckout = {
  key: string;
  type: "text" | "tel" | "cep" | "select" | "textarea";
  label: string;
  required: boolean;
  options?: string[];
  maxLength?: number;
  /** Só aparece quando outro campo tem este valor (ex.: CEP só na entrega). */
  showWhen?: { key: string; equals: string };
  custom?: boolean;
};

export type ConfigLoja = {
  slug: string;
  name: string;
  currency: string;
  locale: string;
  checkoutFields: CampoCheckout[];
  shippingNote: string | null;
};

export type Categoria = { id: string; slug: string; name: string; sort: number };

export type Imagem = { url: string; alt: string; width: number; height: number };

export type Opcao = { name: string; values: string[] };

export type Variante = {
  id: string;
  name: string;
  optionValues: Record<string, string>;
  priceCents: number;
  compareAtCents: number | null;
  available: boolean;
  maxQty: number;
};

export type Produto = {
  id: string;
  slug: string;
  name: string;
  /** Markdown sanitizado pelo admin. */
  description: string | null;
  categoryIds: string[];
  badge: string | null;
  tags: string[];
  meta: Record<string, string>;
  options: Opcao[];
  images: Imagem[];
  variants: Variante[];
};

export type Catalogo = {
  loja: ConfigLoja;
  catalogVersion: number;
  categories: Categoria[];
  products: Produto[];
};

export type Linha = { variantId: string; qty: number };

export type PedidoEntrada = {
  idempotencyKey: string;
  lines: Linha[];
  customer: Record<string, string>;
  sourceDomain: string;
};

export type StatusPedido = "pending_whatsapp" | "confirmed" | "fulfilled" | "cancelled";

export type LinhaPedido = { variantId: string; name: string; unitCents: number; qty: number; lineCents: number };

export type PedidoCriado = {
  code: string;
  status: "pending_whatsapp";
  subtotalCents: number;
  currency: string;
  lines: LinhaPedido[];
  message: string;
  waUrl: string;
};

export type EventosEntrada = {
  events: { type: "carrinho:adicionar" | "checkout:inicio"; at: string; variantId?: string }[];
};

export type LinhaMudou = { variantId: string; reason: "inactive" | "unavailable" | "over_max"; maxQty: number };

export type ErroLoja = {
  erro:
    | { codigo: "CARRINHO_MUDOU"; mensagem: string; detalhes: { lines: LinhaMudou[] } }
    | {
        codigo: "CAMPO_CHECKOUT_INVALIDO";
        mensagem: string;
        detalhes: { fields: { key: string; reason: "required" | "invalid" }[] };
      }
    | { codigo: "PEDIDO_INVALIDO"; mensagem: string; detalhes: { issues: { path: string; message: string }[] } }
    | {
        codigo:
          | "TOKEN_AUSENTE"
          | "TOKEN_INVALIDO"
          | "ROBO_DETECTADO"
          | "NAO_ENCONTRADO"
          | "LIMITE_DE_REQUISICOES"
          | "WHATSAPP_SEM_NUMERO";
        mensagem: string;
      };
};
