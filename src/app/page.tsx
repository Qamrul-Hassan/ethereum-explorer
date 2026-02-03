import WalletInput from "@/app/wallet/wallet-input";
import Image from "next/image";

const features = [
  {
    title: "Wallet Explorer",
    description: "View ETH balance and wallet overview for any Ethereum address.",
  },
  {
    title: "Transactions",
    description: "Inspect transaction history with value, gas, and status.",
  },
  {
    title: "NFT Viewer",
    description: "Explore NFTs owned by a wallet with metadata and images.",
  },
  {
    title: "Gas Tracker",
    description: "Monitor real-time Ethereum gas fees for smarter transactions.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 -top-50 h-125 w-125 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        
{/* Hero Section */}
<section className="relative min-h-[90vh] w-full overflow-hidden pt-24">
  {/* Banner Image */}
  <Image
    src="/images/banner-c.jpg"
    alt="Blockchain and cryptocurrency visualization"
    fill
    priority
    className="object-cover"
  />

  {/* Overlays */}
  <div className="absolute inset-0 bg-slate-950/30" />
  <div className="absolute inset-0 bg-linear-to-b from-indigo-900/40 via-slate-950/80 to-slate-950" />

  {/* Content */}
  <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
    <span className="mb-4 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-slate-300">
      Ethereum Blockchain Explorer
    </span>

    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
      Explore{" "}
      <span className="bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
        Ethereum
      </span>{" "}
      On-Chain Data
    </h1>

    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300/90">
      Analyze wallets, transactions, NFTs, and real-time gas fees using
      trusted blockchain data sources.
    </p>

    <div className="mt-12 w-full max-w-xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <WalletInput />
      </div>
    </div>
  </div>
</section>
        {/* Features Section */}
        <section className="py-24">
          <h2 className="text-center text-3xl font-semibold">
            Everything you need in one place
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Powerful tools to explore Ethereum blockchain data with clarity and
            confidence.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
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
                    Explore →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-10 text-center text-sm text-slate-500">
          Built with Next.js, TypeScript, Etherscan, Alchemy, and OpenSea APIs
        </footer>
      </div>
    </main>
  );
}