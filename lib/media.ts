/** Paths no Blob privado; servidos via `/api/media/…` (store privado da Costa Castro). */

export const BLOB_PREFIX = "costa-castro/instagram-2026-09-21/";

/**
 * Base para URLs de mídia no HTML.
 * - Local/preview: omita ou use `/api/media` (mesma origem).
 * - Produção com domínio próprio: `https://www.costacastro.com.br/api/media`
 */
function mediaBase(): string {
  const fromEnv = process.env.MEDIA_CDN_BASE?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return "/api/media";
}

export function blobPathname(fileName: string): string {
  return `${BLOB_PREFIX}${fileName}`;
}

export function resolveMediaUrl(blobFileName: string | null | undefined): string | null {
  if (!blobFileName) return null;
  return `${mediaBase()}/${blobPathname(blobFileName)}`;
}

/** Path completo no Blob (ex.: `costa-castro/hero/…`). */
export function resolveBlobPathname(pathname: string): string {
  return `${mediaBase()}/${pathname}`;
}
