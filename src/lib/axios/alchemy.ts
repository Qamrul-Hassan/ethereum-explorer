import axios from "axios";

export const alchemyApi = axios.create({
  baseURL: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
});