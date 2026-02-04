"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NftInput() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);

    if (!isValid) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    setError("");
    router.push(`/nfts/${address}`);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs uppercase tracking-widest text-slate-500">
          Wallet Address
        </label>
        <Input
          placeholder="0x..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-2 border-white/10 bg-slate-950/60 text-slate-100 placeholder:text-slate-600 focus-visible:ring-amber-400/40"
        />
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <Button
        onClick={handleSubmit}
        className="w-full bg-amber-400 text-slate-900 hover:bg-amber-300"
      >
        Explore NFTs
      </Button>
    </div>
  );
}
