import Link from "next/link";
import CoinDetails from "@/components/prices/coin-details";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PriceDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-slate-100">
      <div className="mx-auto max-w-6xl px-6">
        <section className="mb-8">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-200">
            Back to prices
          </Link>
          <h1 className="mt-3 text-3xl font-semibold">Price Details</h1>
        </section>

        <CoinDetails id={id} />
      </div>
    </main>
  );
}
