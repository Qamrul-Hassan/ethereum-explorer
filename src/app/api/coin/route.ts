import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";

  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const url = `https://api.coingecko.com/api/v3/coins/${id}`;
  const res = await fetch(url, {
    next: { revalidate: 120 },
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch coin." }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=120, stale-while-revalidate=300",
    },
  });
}
