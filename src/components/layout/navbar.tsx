"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { name: "Live Prices", href: "/" },
  { name: "Favorites", href: "/favorites" },
  { name: "Wallet Explorer", href: "/wallet" },
  { name: "NFT Explorer", href: "/nfts" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

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

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="md:hidden rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
          >
            <div className="relative h-5 w-6">
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 rounded-full bg-current transition duration-300 ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-6 rounded-full bg-current transition duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-6 rounded-full bg-current transition duration-300 ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden border-t border-white/10 bg-slate-950/70 transition-[max-height] duration-300 ${
            open ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
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
