import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner") ?? "";

  if (!owner) {
    return NextResponse.json({ error: "Missing owner." }, { status: 400 });
  }

  const apiKey =
    process.env.ALCHEMY_API_KEY ?? process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  const network =
    process.env.ALCHEMY_NETWORK ??
    process.env.NEXT_PUBLIC_ALCHEMY_NETWORK ??
    "eth-mainnet";

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key." }, { status: 400 });
  }

  const params = new URLSearchParams({
    owner,
    pageSize: "3",
    withMetadata: "true",
  });

  const url = `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?${params.toString()}`;
  const res = await fetch(url, { cache: "no-store" });

  const status = res.status;
  const data = await res.json();

  return NextResponse.json({
    status,
    network,
    owner,
    sample: data?.ownedNfts?.slice?.(0, 3) ?? [],
  });
}
