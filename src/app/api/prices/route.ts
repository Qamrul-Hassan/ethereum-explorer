import { NextResponse } from "next/server";

export async function GET() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h";

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch prices." },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
