"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MarketCoin = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
};

const FAVORITES_KEY = "favoriteCoins";

export default function LivePrices() {
  const [coins, setCoins] = useState<MarketCoin[] | null>(null);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchPrices = async () => {
    try {
      const res = await fetch("/api/prices", { cache: "no-store" });
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
    fetchPrices();
    const id = setInterval(fetchPrices, 30000);
    return () => clearInterval(id);
  }, []);

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

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live Crypto Prices</h2>
        <span className="text-xs text-slate-400">
          {updatedAt ? `Updated ${updatedAt}` : "Loading..."}
        </span>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      ) : (
        <div className="mt-4 flex-1 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[24px_1.4fr_1fr_1fr_1.2fr] gap-2 bg-white/5 px-4 py-2 text-xs text-slate-400">
            <span />
            <span>Coin</span>
            <span>Price</span>
            <span>24h</span>
            <span>Market Cap</span>
          </div>
          <div className="h-full overflow-y-auto">
            {coins?.map((coin) => {
              const change = coin.price_change_percentage_24h ?? 0;
              const changeText = change.toFixed(2);
              const changeClass =
                change >= 0 ? "text-emerald-400" : "text-rose-400";

              return (
                <div
                  key={coin.id}
                  className="grid grid-cols-[24px_1.4fr_1fr_1fr_1.2fr] gap-2 border-t border-white/10 px-4 py-3 text-sm transition hover:bg-white/5"
                >
                  <button
                    type="button"
                    aria-label="Toggle favorite"
                    onClick={() => toggleFavorite(coin.id)}
                    className={`text-xs ${
                      favoriteSet.has(coin.id) ? "text-amber-300" : "text-slate-500"
                    }`}
                  >
                    {favoriteSet.has(coin.id) ? "★" : "☆"}
                  </button>
                  <Link href={`/prices/${coin.id}`} className="min-w-0">
                    <div className="truncate font-medium text-slate-100">
                      {coin.name}
                    </div>
                    <div className="text-xs uppercase text-slate-400">
                      {coin.symbol}
                    </div>
                  </Link>
                  <div className="text-slate-100">
                    ${coin.current_price.toLocaleString()}
                  </div>
                  <div className={changeClass}>{changeText}%</div>
                  <div className="text-slate-300">
                    ${coin.market_cap.toLocaleString()}
                  </div>
                </div>
              );
            })}
            {!coins && (
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
