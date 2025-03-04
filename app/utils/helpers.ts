import { RPC_URL } from "../lib/constants";

export const getExplorerUrl = (assetPublicKey: string) => {
  return RPC_URL && RPC_URL.toLowerCase().includes("devnet")
    ? `https://solana.fm/address/${assetPublicKey}/transactions?cluster=devnet-alpha`
    : `https://solana.fm/address/${assetPublicKey}`;
};

export const transformString = (input: string): string => {
  const start = input.substring(0, 4);
  const end = input.substring(input.length - 4);
  return `${start}...${end}`;
};
