import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Ethereum Explorer",
  description: "Explore Ethereum wallets, transactions, NFTs, and gas fees",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Navbar />
        {children}
        <footer className="border-t border-white/10 bg-slate-950/80 py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:px-6">
            <p>
              © 2026 Ethereum Explorer. Built with Next.js, Etherscan, CoinGecko, and Alchemy.
            </p>
            <p>
              Explore tools on{" "}
              <a
                href="https://costnest.site"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-300 transition"
              >
                CostNest
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
