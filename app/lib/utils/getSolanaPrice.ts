"use client";

import * as Sentry from "@sentry/nextjs";
import useSWR from "swr";

export const getSolanaPrice = () => {
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

  const fetcher = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch Solana price: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      // console.error("🔴 API ERROR [getSolanaPrice]:", (error as Error).message);
      Sentry.captureException(error);
      throw error;
    }
  };

  const { data, error } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 3600000, // 1 hour
  });

  if (error) return undefined;

  const solanaPrice = data ? data.solana.usd : undefined;

  // console.log("🟡 API Response [getSolanaPrice]:", solanaPrice);
  return solanaPrice;
};
