# Costa Castro — site v1 (vitrine + WhatsApp)

Next.js 16 · React 19 · Framer Motion (LazyMotion).

## Desenvolvimento

```bash
cp .env.example .env.local
vercel link --scope consulting-guys --project costa-castro-preview
vercel env pull .env.local --scope consulting-guys
npm ci
CARA_CERTA_USE_FIXTURE=1 npm run dev
```

### Mídia (`MEDIA_CDN_BASE`)

O Blob **ws-costa-castro-blob** é privado. Imagens saem por **`/api/media/…`** (default). **Não** defina `MEDIA_CDN_BASE` como URL `*.private.blob.vercel-storage.com`.

| Situação | `MEDIA_CDN_BASE` |
|---|---|
| Dev / preview (recomendado) | omitir |
| URL absoluta (OG, e-mail) | `https://<domínio>/api/media` |

Guia completo: `company-runtime/docs/03-produto/costa-castro-media-cdn.md`.

Teste local (com `vercel env pull`):

```bash
curl -I "http://localhost:3000/api/media/costa-castro/instagram-2026-09-21/01-cama-karsten-floral.jpg"
```

## Build

```bash
CARA_CERTA_USE_FIXTURE=1 npm run build
```

Com API Cara Certa live: defina `CARA_CERTA_API_URL`, `CARA_CERTA_ORG` e remova `CARA_CERTA_USE_FIXTURE`.

## Documentação de produto (company-runtime)

- Mapa do negócio, mídia e direção visual em `company-runtime/docs/03-produto/costa-castro-*.md`
- Motion: [docs/MOTION.md](docs/MOTION.md)

## Go-live

Preview permanece `noindex` até `NEXT_PUBLIC_SITE_INDEXAVEL=1` e checklist humano em `costa-castro-launch-checklist.md`.
