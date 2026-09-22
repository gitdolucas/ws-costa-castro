import { VitrineEditorialClient } from "@/components/vitrine-editorial-client";
import type { ItemVitrine } from "@/lib/content/vitrine";

export function VitrineEditorial({ itens }: { itens: ItemVitrine[] }) {
  return <VitrineEditorialClient itens={itens} />;
}
