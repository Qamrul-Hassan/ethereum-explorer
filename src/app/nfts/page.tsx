import NftExplorer from "@/components/nfts/nft-explorer";

export default function NftHomePage() {
  return (
    <main className="relative min-h-screen bg-[#0b0f14] pt-24 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-16 top-24 h-56 w-56 rounded-full bg-amber-400/10 blur-[120px]" />
        <div className="absolute right-10 top-56 h-56 w-56 rounded-full bg-sky-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <section className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-widest text-amber-200">
            NFT Suite
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            NFT Explorer
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Track NFT transfer activity with a clean, exchange-grade layout.
          </p>
        </section>

        <section>
          <NftExplorer initialAddress="vitalik.eth" />
        </section>
      </div>
    </main>
  );
}
