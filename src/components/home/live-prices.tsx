"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MarketCoin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
};

type Category = {
  category_id: string;
  name: string;
};

const FAVORITES_KEY = "favoriteCoins";
const STABLES = [
  "USDT",
  "USDC",
  "FDUSD",
  "TUSD",
  "DAI",
  "USDP",
  "BUSD",
  "USD1",
  "USDD",
  "PYUSD",
  "LUSD",
  "FRAX",
];

export default function LivePrices() {
  const [coins, setCoins] = useState<MarketCoin[] | null>(null);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [pairs, setPairs] = useState<Record<string, string[]>>({});
  const [quote, setQuote] = useState<string>("USDT");
  const [pairPrices, setPairPrices] = useState<Record<string, number>>({});

  const fetchPrices = async (category?: string) => {
    try {
      const url = category
        ? `/api/prices?category=${encodeURIComponent(category)}`
        : "/api/prices";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        setError("Unable to load prices right now.");
        return;
      }
      const data = (await res.json()) as MarketCoin[];
      setCoins(data);
      setUpdatedAt(new Date().toLocaleTimeString());
      setError("");
    } catch {
      setError("Unable to load prices right now.");
    }
  };

  useEffect(() => {
    fetchPrices(selectedCategory);
    const id = setInterval(fetchPrices, 30000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchPrices(selectedCategory);
      }
    };
    window.addEventListener("focus", fetchPrices);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", fetchPrices);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as Category[];
      setCategories(Array.isArray(data) ? data : []);
    };

    const fetchPairs = async () => {
      const res = await fetch("/api/binance/pairs", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as Record<string, string[]>;
      setPairs(data ?? {});
    };

    fetchCategories();
    fetchPairs();
  }, []);

  useEffect(() => {
    const fetchBinancePrices = async () => {
      const res = await fetch(`/api/binance/prices?quote=${quote}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as Record<string, number>;
      setPairPrices(data ?? {});
    };

    fetchBinancePrices();
  }, [quote]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored) as string[]);
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  const toggleFavorite = (coinId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(coinId);
      const next = exists ? prev.filter((id) => id !== coinId) : [...prev, coinId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const filteredCoins = useMemo(() => {
    if (!coins) return null;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return coins;
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
    );
  }, [coins, searchQuery]);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live Crypto Prices</h2>
        <span className="text-xs text-slate-300">
          {updatedAt ? `Updated ${updatedAt}` : "Loading..."}
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div>
          <label className="text-[11px] uppercase tracking-widest text-slate-400">
            Search
          </label>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search crypto"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-widest text-slate-400">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-100"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-widest text-slate-400">
            Quote
          </label>
          <select
            value={quote}
            onChange={(event) => setQuote(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-100"
          >
            {STABLES.map((stable) => (
              <option key={stable} value={stable}>
                {stable}
              </option>
            ))}
          </select>
          <p className="mt-2 text-[11px] text-slate-500">
            Pairs powered by Binance
          </p>
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      ) : (
        <div className="mt-4 flex-1 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[24px_1.6fr_1fr_1fr_1fr_1.2fr] gap-2 bg-slate-900/80 px-4 py-2 text-xs text-slate-300">
            <span />
            <span>Coin</span>
            <span>Pair</span>
            <span>Price</span>
            <span>24h</span>
            <span>Market Cap</span>
          </div>
          <div className="h-full overflow-y-auto">
            {filteredCoins?.map((coin) => {
              const change = coin.price_change_percentage_24h ?? 0;
              const changeText = change.toFixed(2);
              const changeClass =
                change >= 0 ? "text-emerald-400" : "text-rose-400";

              return (
                <div
                  key={coin.id}
                  className="grid grid-cols-[24px_1.6fr_1fr_1fr_1fr_1.2fr] gap-2 border-t border-white/10 px-4 py-3 text-sm transition hover:bg-white/10"
                >
                  <button
                    type="button"
                    aria-label="Toggle favorite"
                    onClick={() => toggleFavorite(coin.id)}
                    className={`text-xs ${
                      favoriteSet.has(coin.id) ? "text-amber-300" : "text-slate-400"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill={favoriteSet.has(coin.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M12 17.27l-5.18 3.05 1.4-5.98L3 9.24l6.06-.52L12 3l2.94 5.72 6.06.52-5.22 5.1 1.4 5.98z"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <Link href={`/prices/${coin.id}`} className="min-w-0">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-white">
                          {coin.name}
                        </div>
                        <div className="text-xs uppercase text-slate-300">
                          {coin.symbol}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="text-slate-300">
                    {(() => {
                      const base = coin.symbol.toUpperCase();
                      const available = pairs[base] ?? [];
                      return available.includes(quote) ? `${base}/${quote}` : "-";
                    })()}
                  </div>
                  <div className="text-white">
                    {(() => {
                      const base = coin.symbol.toUpperCase();
                      const pair = `${base}${quote}`;
                      const price = pairPrices[pair];
                      return typeof price === "number"
                        ? price.toLocaleString()
                        : "-";
                    })()}
                  </div>
                  <div className={changeClass}>{changeText}%</div>
                  <div className="text-slate-200">
                    ${coin.market_cap.toLocaleString()}
                  </div>
                </div>
              );
            })}
            {!filteredCoins && (
              <div className="px-4 py-6 text-sm text-slate-400">
                Loading prices...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
