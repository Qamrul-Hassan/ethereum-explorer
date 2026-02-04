import { notFound } from "next/navigation";
import NftExplorer from "@/components/nfts/nft-explorer";

type PageProps = {
  params: Promise<{
    address: string;
  }>;
};

export default async function NftAddressPage({ params }: PageProps) {
  const { address } = await params;

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
  if (!isValidAddress) notFound();

  return (
    <main className="relative min-h-screen bg-[#0b0f14] pt-24 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-10 top-24 h-64 w-64 rounded-full bg-amber-400/10 blur-[140px]" />
        <div className="absolute right-8 top-48 h-64 w-64 rounded-full bg-sky-500/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <section className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-widest text-amber-200">
            NFT Activity
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Recent NFT Transfers
          </h1>
          <p className="mt-3 max-w-3xl break-all text-sm text-slate-400">
            {address}
          </p>
        </section>

        <section>
          <NftExplorer initialAddress={address} />
        </section>
      </div>
    </main>
  );
}
