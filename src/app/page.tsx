import LivePrices from "@/components/home/live-prices";
import Image from "next/image";

const features = [
  {
    title: "Wallet Explorer",
    description: "View balances, transactions, and NFT transfers by address.",
    href: "/wallet",
  },
  {
    title: "Transactions",
    description: "Inspect recent transaction history with value and status.",
    href: "/wallet",
  },
  {
    title: "NFT Explorer",
    description: "Explore recent NFT transfers for any wallet address.",
    href: "/nfts",
  },
  {
    title: "Live Prices",
    description: "Track real-time crypto prices on the homepage.",
    href: "/",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 -top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />
        <div className="absolute right-10 top-40 h-72 w-72 rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="absolute left-10 bottom-10 h-64 w-64 rounded-full bg-purple-500/10 blur-[160px]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6">
        {/* Hero Section */}
        <section className="relative w-full pt-24">
          {/* Banner Image */}
          <div className="relative h-56 w-full overflow-hidden rounded-3xl border border-white/10 md:h-72 lg:h-80">
            <Image
              src="/images/banner-c.jpg"
              alt="Blockchain and cryptocurrency visualization"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/40" />
            <div className="absolute inset-0 bg-linear-to-b from-indigo-900/30 via-slate-950/60 to-slate-950/90" />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-5xl px-6 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-200/80">
                  Ethereum Explorer
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Explore Ethereum On-Chain Data
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200/90 sm:text-base">
                  Analyze wallets, transactions, NFTs, and live crypto prices using
                  trusted blockchain data sources.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center">
            <div className="mt-8 w-full max-w-5xl">
              <LivePrices />
            </div>

            <div className="mt-10 text-sm text-slate-300">
              Use the Wallet Explorer or NFT Explorer tabs to search by address.
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-center text-3xl font-semibold">
            Everything you need in one place
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Powerful tools to explore blockchain data with clarity and
            confidence.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <a
                key={feature.title}
                href={feature.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-indigo-400/40"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-purple-500/10 opacity-0 transition group-hover:opacity-100" />

                <div className="relative">
                  <h3 className="text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-400">
                    {feature.description}
                  </p>

                  <span className="mt-6 inline-block text-sm font-medium text-indigo-400">
                    Explore {"->"}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-10 text-center text-sm text-slate-500">
          Built with Next.js, TypeScript, and Etherscan + CoinGecko APIs
        </footer>
      </div>
    </main>
  );
}
