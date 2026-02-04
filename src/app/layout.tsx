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
        <footer className="border-t border-white/10 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
          © 2026 Ethereum Explorer. Built with Next.js, Etherscan, CoinGecko,
          and Alchemy.
        </footer>
      </body>
    </html>
  );
}
