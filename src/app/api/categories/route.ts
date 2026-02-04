import { NextResponse } from "next/server";

type Category = {
  category_id: string;
  name: string;
};

export async function GET() {
  const url = "https://api.coingecko.com/api/v3/coins/categories/list";
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch categories." },
      { status: res.status }
    );
  }

  const data = (await res.json()) as Category[];
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
