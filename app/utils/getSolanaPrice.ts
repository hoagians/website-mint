"use client";

import * as Sentry from "@sentry/nextjs";
import useSWR from "swr";

export const getSolanaPrice = () => {
  try {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

    const fetcher = (url: string) => fetch(url).then((res) => res.json());

    const { data, error } = useSWR(url, fetcher, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 3600000, // 1 hour
    });

    if (error) throw new Error(error);
    const solanaPrice = data ? data.solana.usd : undefined;

    return solanaPrice;
  } catch (error) {
    Sentry.captureException(error);
  }
};
