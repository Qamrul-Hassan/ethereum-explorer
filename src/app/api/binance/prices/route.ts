import { NextResponse } from "next/server";

type PriceItem = {
  symbol: string;
  price: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const quote = (searchParams.get("quote") ?? "USDT").toUpperCase();

  const url = "https://api.binance.com/api/v3/ticker/price";
  const res = await fetch(url, {
    next: { revalidate: 30 },
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch Binance prices." },
      { status: res.status }
    );
  }

  const data = (await res.json()) as PriceItem[];
  const map: Record<string, number> = {};

  data.forEach((item) => {
    if (item.symbol.endsWith(quote)) {
      const value = Number(item.price);
      if (!Number.isNaN(value)) {
        map[item.symbol] = value;
      }
    }
  });

  return NextResponse.json(map, {
    headers: {
      "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
    },
  });
}
