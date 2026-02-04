import { notFound } from "next/navigation";
import {
  getEthBalance,
  getLatestNftTransfers,
  getLatestTransactions,
} from "@/lib/etherscan";

type PageProps = {
  params: Promise<{
    address: string;
  }>;
};

type TxItem = {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
};

type NftItem = {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  contractAddress: string;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
};

export default async function WalletPage({ params }: PageProps) {
  const { address } = await params;

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
  if (!isValidAddress) notFound();

  let balance: number | null = null;
  let transactions: TxItem[] | null = null;
  let nftTransfers: NftItem[] | null = null;

  try {
    balance = await getEthBalance(address);
    transactions = await getLatestTransactions(address, undefined, 8);
    nftTransfers = await getLatestNftTransfers(address, undefined, 8);
  } catch (error) {
    console.error(error);
  }

  return (
    <main className="relative min-h-screen bg-[#0b0f14] pt-24 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-10 top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-[140px]" />
        <div className="absolute right-8 top-40 h-64 w-64 rounded-full bg-sky-500/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <section className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-widest text-amber-200">
            Wallet Overview
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Address Snapshot
          </h1>
          <p className="mt-3 max-w-3xl break-all text-sm text-slate-400">
            {address}
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-[0_20px_60px_rgba(5,8,14,0.55)]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">ETH Balance</p>
                <span className="text-xs text-slate-500">Live</span>
              </div>
              <div className="mt-4 text-4xl font-semibold tracking-tight text-amber-200">
                {balance !== null ? `${balance.toFixed(4)} ETH` : "-"}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Updated from the selected chain.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">Latest Transactions</p>
                <span className="text-xs text-slate-500">Top 8</span>
              </div>

              {transactions && transactions.length > 0 ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-2 gap-2 bg-white/5 px-4 py-2 text-xs uppercase tracking-wide text-slate-500">
                    <span>Hash</span>
                    <span className="text-right">Value</span>
                  </div>
                  <ul className="divide-y divide-white/5">
                    {transactions.map((tx) => {
                      const ethValue = Number(BigInt(tx.value)) / 1e18;
                      const shortHash = `${tx.hash.slice(0, 6)}...${tx.hash.slice(
                        -4
                      )}`;
                      return (
                        <li
                          key={tx.hash}
                          className="grid grid-cols-2 gap-2 px-4 py-3 text-sm"
                        >
                          <span className="font-mono text-xs text-slate-300">
                            {shortHash}
                          </span>
                          <span className="text-right text-slate-200">
                            {Number.isFinite(ethValue)
                              ? `${ethValue.toFixed(6)} ETH`
                              : "0 ETH"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-400">
                  No transactions found.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">NFT Transfers</p>
              <span className="text-xs text-slate-500">Top 8</span>
            </div>

            {nftTransfers && nftTransfers.length > 0 ? (
              <div className="mt-4 space-y-3">
                {nftTransfers.map((tx) => {
                  const name = tx.tokenName.trim() || tx.tokenSymbol.trim() || "NFT";
                  const shortHash = `${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}`;
                  return (
                    <div
                      key={`${tx.hash}-${tx.tokenID}`}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-100">
                          {name} #{tx.tokenID}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          {shortHash}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                No NFT transfers found.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
