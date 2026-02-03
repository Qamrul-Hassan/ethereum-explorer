"use client";

import Link from "next/link";

const navLinks = [
  { name: "Wallet Explorer", href: "/wallet" },
  { name: "Transactions", href: "/wallet" },
  { name: "NFT Viewer", href: "/nfts" },
  { name: "Gas Tracker", href: "/gas" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full">
      {/* Full-width glass background */}
      <div className="w-full border-b border-white/10 bg-slate-950/50 backdrop-blur">
        {/* Centered content */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-100"
          >
            Ethereum Explorer
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}