/** Snapshot estático — três posts mais recentes na coleta 2026-09-21. */

export type PostInstagram = {
  id: string;
  permalink: string;
  dataPublicacao: string;
  excerpt: string;
  blobImage?: string | null;
};

export const POSTS_INSTAGRAM: PostInstagram[] = [
  {
    id: "DaLYxlGEWZc",
    permalink: "https://www.instagram.com/p/DaLYxlGEWZc/",
    dataPublicacao: "2026",
    excerpt: "Kit floral Karsten — lençol e cobreleito em algodão, estampa natural.",
    blobImage: "01-cama-karsten-floral.jpg",
  },
  {
    id: "DQT6QK2kUDc",
    permalink: "https://www.instagram.com/p/DQT6QK2kUDc/",
    dataPublicacao: "2026",
    excerpt: "Kit EVA Karsten — percal 200 fios.",
    blobImage: "04-cama-karsten-eva.jpg",
  },
  {
    id: "DMdNo_px1-7",
    permalink: "https://www.instagram.com/p/DMdNo_px1-7/",
    dataPublicacao: "2026",
    excerpt: "Edredom dupla face Karsten.",
    blobImage: "14-cama-karsten-edredom-dupla-face.jpg",
  },
];
