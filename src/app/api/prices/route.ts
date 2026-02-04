import { NextResponse } from "next/server";

let lastData: unknown = null;
let lastFetchedAt = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const url =
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h${
      category ? `&category=${encodeURIComponent(category)}` : ""
    }`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        accept: "application/json",
        "user-agent": "ethereum-explorer/1.0",
      },
    });
    if (!res.ok) {
      if (lastData && Date.now() - lastFetchedAt < 5 * 60 * 1000) {
        return NextResponse.json(lastData, {
          headers: {
            "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          },
        });
      }
      return NextResponse.json(
        { error: "Failed to fetch prices." },
        { status: res.status }
      );
    }

    const data = await res.json();
    lastData = data;
    lastFetchedAt = Date.now();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch {
    if (lastData && Date.now() - lastFetchedAt < 5 * 60 * 1000) {
      return NextResponse.json(lastData, {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      });
    }
    return NextResponse.json({ error: "Failed to fetch prices." }, { status: 500 });
  }
}
