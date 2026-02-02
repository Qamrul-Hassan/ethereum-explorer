import axios from "axios";

export const openseaApi = axios.create({
  baseURL: "https://api.opensea.io/api/v1",
});