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
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold">
          Ethereum Explorer
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}