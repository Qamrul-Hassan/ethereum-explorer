const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const ETHERSCAN_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_ETHERSCAN_CHAIN_ID ?? "1"
);

function getChainIdOrDefault(chainId?: number) {
  if (typeof chainId === "number" && Number.isFinite(chainId)) {
    return chainId;
  }
  return Number.isFinite(ETHERSCAN_CHAIN_ID) ? ETHERSCAN_CHAIN_ID : 1;
}

export async function getEthBalance(address: string, chainId?: number) {
  if (!ETHERSCAN_API_KEY) {
    throw new Error("Etherscan API key missing");
  }

  const resolvedChainId = getChainIdOrDefault(chainId);
  const url = `https://api.etherscan.io/v2/api?chainid=${resolvedChainId}&module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;

  let data: { status?: string; result?: string } | null = null;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return 0;
    }
    data = (await res.json()) as { status?: string; result?: string };
  } catch {
    return 0;
  }

  // Etherscan error handling
  if (
    !data ||
    data.status !== "1" ||
    typeof data.result !== "string" ||
    !/^\d+$/.test(data.result)
  ) {
    return 0;
  }

  // Safe BigInt conversion
  const wei = BigInt(data.result);

  // Convert Wei -> ETH (string-safe)
  const eth = Number(wei) / 1e18;

  return Number.isFinite(eth) ? eth : 0;
}

export type EtherscanTx = {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
};

export type EtherscanNftTx = {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  contractAddress: string;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isEtherscanTx(value: unknown): value is EtherscanTx {
  if (!isRecord(value)) return false;
  return (
    typeof value.hash === "string" &&
    typeof value.timeStamp === "string" &&
    typeof value.from === "string" &&
    typeof value.to === "string" &&
    typeof value.value === "string"
  );
}

function isEtherscanNftTx(value: unknown): value is EtherscanNftTx {
  if (!isRecord(value)) return false;
  return (
    typeof value.hash === "string" &&
    typeof value.timeStamp === "string" &&
    typeof value.from === "string" &&
    typeof value.to === "string" &&
    typeof value.contractAddress === "string" &&
    typeof value.tokenID === "string" &&
    typeof value.tokenName === "string" &&
    typeof value.tokenSymbol === "string"
  );
}

export async function getLatestTransactions(
  address: string,
  chainId?: number,
  limit = 5
): Promise<EtherscanTx[]> {
  if (!ETHERSCAN_API_KEY) {
    throw new Error("Etherscan API key missing");
  }

  const resolvedChainId = getChainIdOrDefault(chainId);
  const url = `https://api.etherscan.io/v2/api?chainid=${resolvedChainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${Math.max(
    1,
    limit
  )}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

  let data: { status?: string; result?: unknown } | null = null;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return [];
    }
    data = (await res.json()) as { status?: string; result?: unknown };
  } catch {
    return [];
  }

  if (!data || data.status !== "1" || !Array.isArray(data.result)) {
    return [];
  }

  return data.result.filter(isEtherscanTx);
}

export async function getLatestNftTransfers(
  address: string,
  chainId?: number,
  limit = 5
): Promise<EtherscanNftTx[]> {
  if (!ETHERSCAN_API_KEY) {
    throw new Error("Etherscan API key missing");
  }

  const resolvedChainId = getChainIdOrDefault(chainId);
  const url = `https://api.etherscan.io/v2/api?chainid=${resolvedChainId}&module=account&action=tokennfttx&address=${address}&page=1&offset=${Math.max(
    1,
    limit
  )}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

  let data: { status?: string; result?: unknown } | null = null;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return [];
    }
    data = (await res.json()) as { status?: string; result?: unknown };
  } catch {
    return [];
  }

  if (!data || data.status !== "1" || !Array.isArray(data.result)) {
    return [];
  }

  return data.result.filter(isEtherscanNftTx);
}
