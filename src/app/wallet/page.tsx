import WalletInput from "@/app/wallet/wallet-input";

export default function WalletHomePage() {
  return (
    <main className="relative min-h-screen bg-[#0b0f14] pt-24 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-400/10 blur-[120px]" />
        <div className="absolute right-10 top-40 h-48 w-48 rounded-full bg-sky-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <section className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-widest text-amber-200">
            Wallet Suite
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Wallet Explorer
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Inspect balances, latest transactions, and NFT transfers with a
            professional trading desk layout.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-[0_20px_60px_rgba(5,8,14,0.55)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Search by address</p>
              <span className="text-xs text-slate-500">Mainnet or Base</span>
            </div>
            <div className="mt-4">
              <WalletInput />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <h2 className="text-sm uppercase tracking-widest text-slate-500">
              What you get
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Live ETH balance snapshot
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Recent transactions with values
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                NFT transfer activity
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
