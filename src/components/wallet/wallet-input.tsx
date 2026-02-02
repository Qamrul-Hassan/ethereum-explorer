"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidEthAddress } from "@/lib/utils";

export default function WalletInput() {
  const [address, setAddress] = useState("");
  const isValid = isValidEthAddress(address);

  return (
    <div className="max-w-xl space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Ethereum Wallet Address
        </label>

        <Input
          placeholder="0x..."
          value={address}
          onChange={(e) => setAddress(e.target.value.trim())}
        />

        {!isValid && address.length > 0 && (
          <p className="text-sm text-red-500">
            Invalid Ethereum address
          </p>
        )}
      </div>

      <Button disabled={!isValid}>
        Explore Wallet
      </Button>
    </div>
  );
}