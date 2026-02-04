import { NextResponse } from "next/server";

type BinanceSymbol = {
  status: string;
  baseAsset: string;
  quoteAsset: string;
};

type ExchangeInfo = {
  symbols: BinanceSymbol[];
};

export async function GET() {
  const url = "https://api.binance.com/api/v3/exchangeInfo";
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch Binance pairs." },
      { status: res.status }
    );
  }

  const data = (await res.json()) as ExchangeInfo;
  const map: Record<string, string[]> = {};

  data.symbols
    .filter((symbol) => symbol.status === "TRADING")
    .forEach((symbol) => {
      if (!map[symbol.baseAsset]) {
        map[symbol.baseAsset] = [];
      }
      map[symbol.baseAsset].push(symbol.quoteAsset);
    });

  return NextResponse.json(map, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
