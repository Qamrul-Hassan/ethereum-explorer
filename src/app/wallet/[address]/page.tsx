import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    address: string;
  }>;
};

export default async function WalletPage({ params }: PageProps) {
  const { address } = await params;

  // Ethereum address validation
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);

  if (!isValidAddress) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-slate-100">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <section className="mb-12">
          <h1 className="text-2xl font-semibold">
            Wallet Explorer
          </h1>
          <p className="mt-2 break-all text-sm text-slate-400">
            {address}
          </p>
        </section>

        {/* Overview cards */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">
              ETH Balance
            </p>
            <p className="mt-2 text-xl font-semibold">
              —
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">
              Transactions
            </p>
            <p className="mt-2 text-xl font-semibold">
              —
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">
              NFTs
            </p>
            <p className="mt-2 text-xl font-semibold">
              —
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
