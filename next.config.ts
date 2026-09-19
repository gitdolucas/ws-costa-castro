import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Permite um segundo dev server (preview) sem brigar com o .next de outro.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // O monorepo tem outro lockfile acima; sem isto o Turbopack escolhe a raiz errada.
  turbopack: { root: path.resolve(process.cwd()) },
  // Fotos de produto vêm do Vercel Blob do admin.
  images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
};

export default nextConfig;
