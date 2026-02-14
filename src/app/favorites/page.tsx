"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MarketCoin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
};

const FAVORITES_KEY = "favoriteCoins";

export default function FavoritesPage() {
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [error, setError] = useState("");

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
        setError("");
        return;
      }

      const favoriteSet = new Set(favorites);

      try {
        setLoading(true);
        let mergedCoins: MarketCoin[] = [];

        try {
          const pricesRes = await fetch("/api/prices", { cache: "no-store" });
          if (pricesRes.ok) {
            const pricesData = (await pricesRes.json()) as MarketCoin[];
            if (Array.isArray(pricesData)) {
              mergedCoins = pricesData.filter((coin) => favoriteSet.has(coin.id));
            }
          }
        } catch {}

        const existingIds = new Set(mergedCoins.map((coin) => coin.id));
        const missingIds = favorites.filter((id) => !existingIds.has(id));

        if (missingIds.length > 0) {
          try {
            const params = new URLSearchParams({ ids: missingIds.join(",") });
            const favoritesRes = await fetch(`/api/favorites?${params.toString()}`, {
              cache: "no-store",
            });

            if (favoritesRes.ok) {
              const favoritesData = (await favoritesRes.json()) as MarketCoin[];
              if (Array.isArray(favoritesData) && favoritesData.length > 0) {
                const byId = new Map(mergedCoins.map((coin) => [coin.id, coin]));
                favoritesData.forEach((coin) => byId.set(coin.id, coin));
                mergedCoins = favorites
                  .map((id) => byId.get(id))
                  .filter((coin): coin is MarketCoin => Boolean(coin));
              }
            }
          } catch {}
        }

        if (mergedCoins.length > 0) {
          setCoins(mergedCoins);
          setError("");
        } else {
          setError("Unable to load favorites right now.");
          setCoins([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  const removeFavorite = (coinId: string) => {
    const next = favorites.filter((id) => id !== coinId);
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    setCoins((prev) => prev.filter((coin) => coin.id !== coinId));
  };

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="mb-10">
          <h1 className="text-3xl font-semibold">Favorite Crypto</h1>
          <p className="mt-2 text-sm text-slate-300">
            Your starred coins, kept up to date.
          </p>
        </section>

        {favorites.length === 0 && (
          <p className="text-sm text-slate-300">
            No favorites yet. Star coins on the home page.
          </p>
        )}

        {loading && (
          <p className="text-sm text-slate-300">Loading favorites...</p>
        )}

        {error && coins.length === 0 && (
          <p className="text-sm text-rose-300">{error}</p>
        )}

        {coins.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
            <div className="overflow-x-auto">
              <div className="grid min-w-[720px] grid-cols-[40px_1.6fr_1fr_1fr_1.2fr] gap-2 bg-slate-900/80 px-4 py-2 text-xs text-slate-300">
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
                    className="grid min-w-[720px] grid-cols-[40px_1.6fr_1fr_1fr_1.2fr] items-center gap-2 border-t border-white/10 px-4 py-3 text-sm"
                  >
                    <button
                      type="button"
                      aria-label={`Remove ${coin.name} from favorites`}
                      onClick={() => removeFavorite(coin.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-rose-300"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
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
                    <div className="text-white">
                      ${coin.current_price.toLocaleString()}
                    </div>
                    <div className={changeClass}>{change.toFixed(2)}%</div>
                    <div className="text-slate-200">
                      ${coin.market_cap.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
