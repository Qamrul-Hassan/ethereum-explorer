"use client";

import { useEffect, useMemo, useState } from "react";

type AlchemyNft = {
  tokenId: string;
  name?: string;
  image?: {
    cachedUrl?: string;
    thumbnailUrl?: string;
    originalUrl?: string;
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
  };
  resolvedImage?: string;
};

type NftsResponse = {
  ownedNfts?: AlchemyNft[];
  totalCount?: number;
  pageKey?: string;
};

const PAGE_SIZE = 24;

function isValidAddressOrEns(value: string) {
  const trimmed = value.trim();
  return /^0x[a-fA-F0-9]{40}$/.test(trimmed) || trimmed.includes(".");
}

function normalizeImageUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("ipfs://")) {
    return `https://cloudflare-ipfs.com/ipfs/${url.replace("ipfs://", "")}`;
  }
  return url;
}

function isDataUrl(url: string) {
  return url.startsWith("data:");
}

export default function NftExplorer({
  initialAddress = "",
}: {
  initialAddress?: string;
}) {
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState<AlchemyNft[]>([]);
  const [pageKey, setPageKey] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [collectionQuery, setCollectionQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "tokenId" | "contract">(
    "name"
  );

  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "";
  const baseUrl = useMemo(() => "/api/nfts", []);

  const fetchNfts = async (owner: string, nextPageKey?: string | null) => {
    if (!isValidAddressOrEns(owner)) {
      setError("Please enter a valid wallet address or ENS.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        owner,
        pageSize: PAGE_SIZE.toString(),
      });
      if (nextPageKey) {
        params.set("pageKey", nextPageKey);
      }

      const res = await fetch(`${baseUrl}?${params.toString()}`);
      if (!res.ok) {
        setError("Unable to load NFTs right now.");
        setLoading(false);
        return;
      }

      const data = (await res.json()) as NftsResponse;
      const owned = data.ownedNfts ?? [];

      setNfts((prev) => (nextPageKey ? [...prev, ...owned] : owned));
      setPageKey(data.pageKey ?? null);
      setTotalCount(typeof data.totalCount === "number" ? data.totalCount : null);
      setLoading(false);
    } catch {
      setError("Unable to load NFTs right now.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialAddress) {
      fetchNfts(initialAddress, null);
    }
  }, [initialAddress]);

  const handleSearch = () => {
    fetchNfts(address.trim(), null);
  };

  const filtered = useMemo(() => {
    const query = collectionQuery.trim().toLowerCase();
    const base = query
      ? nfts.filter((nft) => {
          const name = nft.contract?.name ?? "";
          const symbol = nft.contract?.symbol ?? "";
          return (
            name.toLowerCase().includes(query) ||
            symbol.toLowerCase().includes(query)
          );
        })
      : nfts;

    const sorted = [...base].sort((a, b) => {
      if (sortBy === "tokenId") {
        return (a.tokenId ?? "").localeCompare(b.tokenId ?? "");
      }
      if (sortBy === "contract") {
        return (a.contract?.name ?? "").localeCompare(b.contract?.name ?? "");
      }
      return (a.name ?? "").localeCompare(b.name ?? "");
    });

    return sorted;
  }, [collectionQuery, nfts, sortBy]);

  const groupedByCollection = useMemo(() => {
    const map = new Map<
      string,
      { title: string; key: string; items: AlchemyNft[] }
    >();
    filtered.forEach((nft) => {
      const key =
        nft.contract?.address ??
        nft.contract?.name ??
        nft.contract?.symbol ??
        "unknown";
      const title =
        nft.contract?.name ??
        nft.contract?.symbol ??
        "Unknown Collection";
      const existing = map.get(key);
      if (existing) {
        existing.items.push(nft);
      } else {
        map.set(key, { title, key, items: [nft] });
      }
    });
    return Array.from(map.values());
  }, [filtered]);

  useEffect(() => {
    if (!apiKey) {
      setError("Missing Alchemy API key.");
    }
  }, [apiKey]);

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-[0_20px_60px_rgba(5,8,14,0.55)]">
        <div className="space-y-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500">
              Wallet Address or ENS
            </label>
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="0x... or vitalik.eth"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="mt-4 w-full rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              Search NFTs
            </button>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500">
              Collection Filter
            </label>
            <input
              value={collectionQuery}
              onChange={(event) => setCollectionQuery(event.target.value)}
              placeholder="Filter by collection name or symbol"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500">
              Sort
            </label>
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "name" | "tokenId" | "contract")
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10"
            >
              <option value="name">Name</option>
              <option value="tokenId">Token ID</option>
              <option value="contract">Collection</option>
            </select>
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}
          {totalCount !== null && (
            <p className="text-xs text-slate-400">
              Showing {nfts.length} of {totalCount} NFTs
            </p>
          )}
          <p className="text-xs text-slate-500">
            Floor price and rarity sorting require a marketplace data provider.
          </p>
        </div>
      </aside>

      <div className="space-y-4">
        <div className="space-y-8">
          {groupedByCollection.map((group) => (
            <section key={group.key}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">
                  {group.title}
                </h3>
                <span className="text-xs text-slate-500">
                  {group.items.length} items
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map((nft, index) => {
                  const image = normalizeImageUrl(
                    nft.resolvedImage ??
                      nft.image?.cachedUrl ??
                      nft.image?.thumbnailUrl ??
                      nft.image?.originalUrl ??
                      nft.media?.[0]?.gateway ??
                      nft.media?.[0]?.raw ??
                      nft.tokenUri?.gateway ??
                      nft.tokenUri?.raw
                  );
                  const title =
                    nft.name ||
                    nft.contract?.name ||
                    nft.contract?.symbol ||
                    `NFT #${nft.tokenId}`;
                  const contract = nft.contract?.address ?? "";
                  const shortContract = contract
                    ? `${contract.slice(0, 6)}...${contract.slice(-4)}`
                    : "Unknown";

                  return (
                    <div
                      key={`${nft.tokenId}-${index}`}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={
                              isDataUrl(image)
                                ? image
                                : `/api/nft-image?url=${encodeURIComponent(
                                    image
                                  )}`
                            }
                            alt={title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-500">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-sm font-semibold text-slate-100">
                          {title}
                        </p>
                        <p className="text-xs text-slate-400">
                          Token #{nft.tokenId}
                        </p>
                        <p className="text-xs text-slate-500">
                          {shortContract}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {loading && (
          <p className="text-sm text-slate-400">Loading NFTs...</p>
        )}

        {!loading && nfts.length === 0 && (
          <p className="text-sm text-slate-400">
            Enter a wallet address to view NFTs.
          </p>
        )}

        {pageKey && !loading && (
          <button
            type="button"
            onClick={() => fetchNfts(address.trim(), pageKey)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-amber-400/40 hover:text-amber-200"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
