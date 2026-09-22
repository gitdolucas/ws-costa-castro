import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

const ALLOWED_PREFIX = "costa-castro/";

/** Entrega mídia do Blob privado conectado ao projeto (sem expor token no browser). */
export async function GET(_request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const pathname = path.join("/");

  if (!pathname.startsWith(ALLOWED_PREFIX)) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
  }

  const result = await get(pathname, { access: "private" });

  if (!result || result.statusCode !== 200) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
