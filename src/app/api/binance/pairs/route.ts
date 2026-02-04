import { NextResponse } from "next/server";

type BinanceSymbol = {
  status: string;
  baseAsset: string;
  quoteAsset: string;
};

type ExchangeInfo = {
  symbols: BinanceSymbol[];
};

let lastPairs: Record<string, string[]> | null = null;
let lastPairsAt = 0;

export async function GET() {
  const url = "https://api.binance.com/api/v3/exchangeInfo";
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: {
      accept: "application/json",
      "user-agent": "ethereum-explorer/1.0",
    },
  });

  if (!res.ok) {
    if (lastPairs && Date.now() - lastPairsAt < 6 * 60 * 60 * 1000) {
      return NextResponse.json(lastPairs, {
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    }
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

  lastPairs = map;
  lastPairsAt = Date.now();
  return NextResponse.json(map, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
