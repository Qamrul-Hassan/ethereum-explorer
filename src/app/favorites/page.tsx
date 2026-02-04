"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MarketCoin = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
};

const FAVORITES_KEY = "favoriteCoins";

export default function FavoritesPage() {
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      const ids = stored ? (JSON.parse(stored) as string[]) : [];
      setFavorites(ids);
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setCoins([]);
        return;
      }
      setLoading(true);
      const ids = favorites.join(",");
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;
      const res = await fetch(url, { cache: "no-store" });
      const data = (await res.json()) as MarketCoin[];
      setCoins(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    fetchFavorites();
  }, [favorites]);

  const removeFavorite = (coinId: string) => {
    const next = favorites.filter((id) => id !== coinId);
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-slate-100">
      <div className="mx-auto max-w-6xl px-6">
        <section className="mb-10">
          <h1 className="text-3xl font-semibold">Favorite Crypto</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your starred coins, kept up to date.
          </p>
        </section>

        {favorites.length === 0 && (
          <p className="text-sm text-slate-400">
            No favorites yet. Star coins on the home page.
          </p>
        )}

        {loading && (
          <p className="text-sm text-slate-400">Loading favorites...</p>
        )}

        {coins.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[24px_1.4fr_1fr_1fr_1.2fr] gap-2 bg-white/5 px-4 py-2 text-xs text-slate-400">
              <span />
              <span>Coin</span>
              <span>Price</span>
              <span>24h</span>
              <span>Market Cap</span>
            </div>
            {coins.map((coin) => {
              const change = coin.price_change_percentage_24h ?? 0;
              const changeClass =
                change >= 0 ? "text-emerald-400" : "text-rose-400";
              return (
                <div
                  key={coin.id}
                  className="grid grid-cols-[24px_1.4fr_1fr_1fr_1.2fr] gap-2 border-t border-white/10 px-4 py-3 text-sm"
                >
                  <button
                    type="button"
                    aria-label="Remove favorite"
                    onClick={() => removeFavorite(coin.id)}
                    className="text-amber-300"
                  >
                    ★
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
                  <div className={changeClass}>{change.toFixed(2)}%</div>
                  <div className="text-slate-300">
                    ${coin.market_cap.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
