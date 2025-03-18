import { RPC_URL } from "../constants";

export const getExplorerUrl = (assetPublicKey: string) => {
  return RPC_URL && RPC_URL.toLowerCase().includes("devnet")
    ? `https://solana.fm/address/${assetPublicKey}/transactions?cluster=devnet-alpha`
    : `https://solana.fm/address/${assetPublicKey}`;
};
