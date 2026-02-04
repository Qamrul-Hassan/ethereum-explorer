import { NextResponse } from "next/server";

type AlchemyNft = {
  tokenId: string;
  name?: string;
  image?: {
    cachedUrl?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
  };
  raw?: {
    metadata?: {
      image?: string;
      image_url?: string;
      imageUrl?: string;
    };
  };
  collection?: {
    imageUrl?: string;
    bannerImageUrl?: string;
  };
  media?: {
    gateway?: string;
    raw?: string;
  }[];
  tokenUri?: {
    raw?: string;
    gateway?: string;
  };
  contract?: {
    address?: string;
    name?: string;
    symbol?: string;
    openSeaMetadata?: {
      imageUrl?: string;
      bannerImageUrl?: string;
    };
  };
};

type NftsResponse = {
  ownedNfts?: AlchemyNft[];
  totalCount?: number;
  pageKey?: string;
};

type MetadataResponse = {
  image?: {
    cachedUrl?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
  };
  rawMetadata?: {
    image?: string;
    image_url?: string;
    imageUrl?: string;
  };
  media?: {
    gateway?: string;
    raw?: string;
  }[];
};

function normalizeUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("ipfs://")) {
    return `https://cloudflare-ipfs.com/ipfs/${url.replace("ipfs://", "")}`;
  }
  return url;
}

function pickImage(nft: AlchemyNft) {
  return (
    normalizeUrl(nft.image?.cachedUrl) ||
    normalizeUrl(nft.image?.thumbnailUrl) ||
    normalizeUrl(nft.image?.originalUrl) ||
    normalizeUrl(nft.raw?.metadata?.image) ||
    normalizeUrl(nft.raw?.metadata?.image_url) ||
    normalizeUrl(nft.raw?.metadata?.imageUrl) ||
    normalizeUrl(nft.contract?.openSeaMetadata?.imageUrl) ||
    normalizeUrl(nft.contract?.openSeaMetadata?.bannerImageUrl) ||
    normalizeUrl(nft.collection?.imageUrl) ||
    normalizeUrl(nft.collection?.bannerImageUrl) ||
    normalizeUrl(nft.media?.[0]?.gateway) ||
    normalizeUrl(nft.media?.[0]?.raw) ||
    normalizeUrl(nft.tokenUri?.gateway) ||
    normalizeUrl(nft.tokenUri?.raw)
  );
}

async function fetchMetadataImage(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    });
    if (!res.ok) return "";
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.startsWith("image/")) {
      return normalizeUrl(url);
    }
    if (contentType.includes("application/json")) {
      const data = (await res.json()) as {
        image?: string;
        image_url?: string;
        imageUrl?: string;
      };
      return normalizeUrl(data.image ?? data.image_url ?? data.imageUrl);
    }

    const text = await res.text();
    try {
      const data = JSON.parse(text) as {
        image?: string;
        image_url?: string;
        imageUrl?: string;
      };
      return normalizeUrl(data.image ?? data.image_url ?? data.imageUrl);
    } catch {
      return "";
    }
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchNftMetadataImage(
  network: string,
  apiKey: string,
  contractAddress: string,
  tokenId: string
) {
  const params = new URLSearchParams({ contractAddress, tokenId });
  const url = `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTMetadata?${params.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return "";
  const data = (await res.json()) as MetadataResponse;
  return (
    normalizeUrl(data.image?.cachedUrl) ||
    normalizeUrl(data.image?.thumbnailUrl) ||
    normalizeUrl(data.image?.originalUrl) ||
    normalizeUrl(data.rawMetadata?.image) ||
    normalizeUrl(data.rawMetadata?.image_url) ||
    normalizeUrl(data.rawMetadata?.imageUrl) ||
    normalizeUrl(data.media?.[0]?.gateway) ||
    normalizeUrl(data.media?.[0]?.raw)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner") ?? "";
  const pageKey = searchParams.get("pageKey");
  const pageSize = searchParams.get("pageSize") ?? "24";

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
    pageSize,
    withMetadata: "true",
  });
  if (pageKey) params.set("pageKey", pageKey);

  const url = `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch NFTs." }, { status: 500 });
  }

  const data = (await res.json()) as NftsResponse;
  const owned = data.ownedNfts ?? [];

  let metadataRequests = 0;
  const enriched = await Promise.all(
    owned.map(async (nft) => {
      const baseImage = pickImage(nft);
      if (baseImage && !baseImage.endsWith(".json")) {
        return { ...nft, resolvedImage: baseImage };
      }

      const tokenUri = normalizeUrl(nft.tokenUri?.raw ?? nft.tokenUri?.gateway);
      if (!tokenUri) {
        return { ...nft, resolvedImage: baseImage };
      }

      const metaImage = await fetchMetadataImage(tokenUri);
      let resolved = metaImage || baseImage;

      if (!resolved && nft.contract?.address && metadataRequests < 10) {
        metadataRequests += 1;
        const perTokenImage = await fetchNftMetadataImage(
          network,
          apiKey,
          nft.contract.address,
          nft.tokenId
        );
        resolved = perTokenImage || resolved;
      }

      return { ...nft, resolvedImage: resolved };
    })
  );

  return NextResponse.json({
    ownedNfts: enriched,
    totalCount: data.totalCount ?? 0,
    pageKey: data.pageKey ?? null,
  });
}
