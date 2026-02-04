import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const network = process.env.NEXT_PUBLIC_ALCHEMY_NETWORK ?? "eth-mainnet";

if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_ALCHEMY_API_KEY");
}

export const alchemyApi = axios.create({
  baseURL: `https://${network}.g.alchemy.com/nft/v3/${apiKey}`,
});

export async function getNftsForOwner(owner: string, pageSize = 24) {
  const res = await alchemyApi.get("/getNFTsForOwner", {
    params: { owner, pageSize },
  });
  return res.data;
}

export async function getNftMetadata(
  contractAddress: string,
  tokenId: string
) {
  const res = await alchemyApi.get("/getNFTMetadata", {
    params: { contractAddress, tokenId },
  });
  return res.data;
}
