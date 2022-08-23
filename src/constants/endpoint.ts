import { clusterApiUrl } from "@solana/web3.js";

export default {
  devnet: clusterApiUrl("devnet"),
  ["mainnet-beta"]: clusterApiUrl("mainnet-beta"),
  testnet: clusterApiUrl("testnet"),
};
