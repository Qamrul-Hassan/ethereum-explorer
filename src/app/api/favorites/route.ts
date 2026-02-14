import { NextResponse } from "next/server";

let lastDataByIds = new Map<string, unknown>();
let lastFetchedAtByIds = new Map<string, number>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") ?? "").trim();

  if (!ids) {
    return NextResponse.json({ error: "Missing ids query param." }, { status: 400 });
  }

  const cacheKey = ids;
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
    ids
  )}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        accept: "application/json",
        "user-agent": "ethereum-explorer/1.0",
      },
    });

    if (!res.ok) {
      const lastData = lastDataByIds.get(cacheKey);
      const lastFetchedAt = lastFetchedAtByIds.get(cacheKey) ?? 0;

      if (lastData && Date.now() - lastFetchedAt < 5 * 60 * 1000) {
        return NextResponse.json(lastData, {
          headers: {
            "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          },
        });
      }

      return NextResponse.json(
        { error: "Failed to fetch favorites." },
        { status: res.status }
      );
    }

    const data = await res.json();
    lastDataByIds.set(cacheKey, data);
    lastFetchedAtByIds.set(cacheKey, Date.now());

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch {
    const lastData = lastDataByIds.get(cacheKey);
    const lastFetchedAt = lastFetchedAtByIds.get(cacheKey) ?? 0;

    if (lastData && Date.now() - lastFetchedAt < 5 * 60 * 1000) {
      return NextResponse.json(lastData, {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      });
    }

    return NextResponse.json({ error: "Failed to fetch favorites." }, { status: 500 });
  }
}
