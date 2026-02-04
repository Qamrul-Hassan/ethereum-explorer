"use client";

import { useEffect, useMemo, useState } from "react";

type CoinDetails = {
  id: string;
  name: string;
  symbol: string;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number | null;
  };
};

type MarketChart = {
  prices: [number, number][];
};

type ChartPoint = {
  x: number;
  y: number;
};

export default function CoinDetails({ id }: { id: string }) {
  const [details, setDetails] = useState<CoinDetails | null>(null);
  const [chart, setChart] = useState<MarketChart | null>(null);
  const [error, setError] = useState("");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [range, setRange] = useState<"1" | "7" | "30" | "365">("7");
  const [loadingChart, setLoadingChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailsRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}`,
          { cache: "no-store" }
        );

        if (!detailsRes.ok) {
          setError("Unable to load coin details.");
          return;
        }

        const detailsData = (await detailsRes.json()) as CoinDetails;
        setDetails(detailsData);
        setError("");
      } catch {
        setError("Unable to load coin details.");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        setLoadingChart(true);
        const chartRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${range}`,
          { cache: "no-store" }
        );

        if (!chartRes.ok) {
          setError("Unable to load coin details.");
          setLoadingChart(false);
          return;
        }

        const chartData = (await chartRes.json()) as MarketChart;
        setChart(chartData);
        setHoverIndex(null);
        setLoadingChart(false);
      } catch {
        setError("Unable to load coin details.");
        setLoadingChart(false);
      }
    };

    fetchChart();
  }, [id, range]);

  const points = useMemo<ChartPoint[]>(() => {
    if (!chart?.prices?.length) return [];

    const prices = chart.prices.map(([, price]) => price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    return chart.prices.map(([, price], index) => ({
      x: (index / (chart.prices.length - 1)) * 100,
      y: 100 - ((price - min) / range) * 100,
    }));
  }, [chart]);

  const series = useMemo(() => {
    if (!chart?.prices?.length) return [];
    return chart.prices.map(([timestamp, price], index) => ({
      index,
      timestamp,
      price,
      x: points[index]?.x ?? 0,
      y: points[index]?.y ?? 0,
    }));
  }, [chart, points]);

  const stats = useMemo(() => {
    if (!chart?.prices?.length) return null;
    const prices = chart.prices.map(([, price]) => price);
    const open = prices[0];
    const close = prices[prices.length - 1];
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const change = ((close - open) / open) * 100;
    return { open, close, high, low, change };
  }, [chart]);

  const chartPath = useMemo(() => {
    if (!points.length) return "";
    return points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
      .join(" ");
  }, [points]);

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (!details) {
    return <p className="text-sm text-slate-400">Loading details...</p>;
  }

  const change = details.market_data.price_change_percentage_24h ?? 0;
  const changeClass = change >= 0 ? "text-emerald-400" : "text-rose-400";

  const hovered = hoverIndex !== null ? series[hoverIndex] : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-transparent p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold">{details.name}</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs uppercase text-slate-300">
                {details.symbol}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">Price Overview</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold tracking-tight">
              ${details.market_data.current_price.usd.toLocaleString()}
            </div>
            <div className={`text-sm ${changeClass}`}>
              {change.toFixed(2)}% 24h
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {[
            { label: "1D", value: "1" },
            { label: "7D", value: "7" },
            { label: "30D", value: "30" },
            { label: "1Y", value: "365" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRange(item.value as "1" | "7" | "30" | "365")}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                range === item.value
                  ? "border-sky-400/70 bg-sky-500/10 text-sky-200"
                  : "border-white/10 text-slate-400 hover:border-white/30 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative mt-4 h-72 w-full">
          {chartPath ? (
            <div
              className="h-full w-full"
              onMouseLeave={() => setHoverIndex(null)}
              onMouseMove={(event) => {
                if (!series.length) return;
                const rect = event.currentTarget.getBoundingClientRect();
                const ratio = (event.clientX - rect.left) / rect.width;
                const index = Math.min(
                  series.length - 1,
                  Math.max(0, Math.round(ratio * (series.length - 1)))
                );
                setHoverIndex(index);
              }}
            >
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`${chartPath} L 100 100 L 0 100 Z`}
                  fill="url(#chartFill)"
                />
                <path
                  d={chartPath}
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="2"
                />
                {hovered && (
                  <>
                    <line
                      x1={hovered.x}
                      x2={hovered.x}
                      y1="0"
                      y2="100"
                      stroke="#334155"
                      strokeDasharray="2 3"
                    />
                    <circle
                      cx={hovered.x}
                      cy={hovered.y}
                      r="1.5"
                      fill="#f8fafc"
                      stroke="#60a5fa"
                      strokeWidth="1"
                    />
                  </>
                )}
              </svg>
              {hovered && (
                <div
                  className="pointer-events-none absolute rounded-lg border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-slate-200 shadow-lg"
                  style={{
                    left: `calc(${hovered.x}% - 40px)`,
                    top: "12px",
                  }}
                >
                  <div className="font-medium">
                    ${hovered.price.toLocaleString()}
                  </div>
                  <div className="text-slate-400">
                    {new Date(hovered.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              {loadingChart ? "Chart loading..." : "No chart data."}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Open ({range}d)</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              {stats ? `$${stats.open.toLocaleString()}` : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">High ({range}d)</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              {stats ? `$${stats.high.toLocaleString()}` : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Low ({range}d)</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              {stats ? `$${stats.low.toLocaleString()}` : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Close ({range}d)</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              {stats ? `$${stats.close.toLocaleString()}` : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Change ({range}d)</p>
            <p
              className={`mt-2 text-lg font-semibold ${
                stats && stats.change >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {stats ? `${stats.change.toFixed(2)}%` : "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm text-slate-400">Details</h3>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Market Cap</span>
            <span className="text-slate-100">
              ${details.market_data.market_cap.usd.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">24h Volume</span>
            <span className="text-slate-100">
              ${details.market_data.total_volume.usd.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
