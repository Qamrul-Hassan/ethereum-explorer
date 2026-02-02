import axios from "axios";

export const etherscanApi = axios.create({
  baseURL: "https://api.etherscan.io/api",
  params: {
    apikey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
  },
});