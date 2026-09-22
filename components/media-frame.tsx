import { resolveMediaUrl } from "@/lib/media";

export function MediaFrame({
  blobImage,
  alt,
  className = "",
}: {
  blobImage?: string | null;
  alt: string;
  className?: string;
}) {
  const src = resolveMediaUrl(blobImage ?? null);

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`media-frame ${className}`.trim()} loading="lazy" decoding="async" />;
  }

  return (
    <div className={`media-frame media-frame--placeholder ${className}`.trim()} role="img" aria-label={alt}>
      <span className="sr-only">{alt}</span>
    </div>
  );
}
