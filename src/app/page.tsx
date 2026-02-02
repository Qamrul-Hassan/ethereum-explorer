import WalletInput from "@/components/wallet/wallet-input";

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
    <main className="mx-auto max-w-7xl px-6">
      {/* Hero Section */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Ethereum Explorer
        </h1>

        <p className="mt-4 max-w-2xl text-gray-600">
          Explore Ethereum wallets, transactions, NFTs, and gas fees using real
          blockchain data.
        </p>

        <div className="mt-8 w-full flex justify-center">
          <WalletInput />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-center text-2xl font-semibold">
          What you can explore
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border p-6 hover:shadow-sm transition"
            >
              <h3 className="text-lg font-medium">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        Built with Next.js, Etherscan, Alchemy, and OpenSea APIs
      </footer>
    </main>
  );
}