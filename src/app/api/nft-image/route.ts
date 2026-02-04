import { NextResponse } from "next/server";

function normalizeUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("ipfs://")) {
    return `https://cloudflare-ipfs.com/ipfs/${url.replace("ipfs://", "")}`;
  }
  return url;
}

function isSafeUrl(url: string) {
  return url.startsWith("https://") || url.startsWith("http://");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("url") ?? "";
  const normalized = normalizeUrl(raw);

  if (!normalized || !isSafeUrl(normalized)) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const res = await fetch(normalized, { cache: "force-cache" });
  if (!res.ok) {
    return NextResponse.json({ error: "Image fetch failed" }, { status: 502 });
  }

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
