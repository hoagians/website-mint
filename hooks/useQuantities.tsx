"use client";

import { useEffect, useState } from "react";
import { getQuantities } from "../app/services/CountingService";

export const useQuantities = () => {
  const [mintedAssets, setMintedAssets] = useState<number | null>(null);
  const [purchasedAssets, setPurchasedAssets] = useState<number | null>(null);
  const [whitelistSize, setWhitelistSize] = useState<number | null>(null);

  const fetchQuantities = async () => {
    const { whitelisted, purchased, minted } = await getQuantities();

    setMintedAssets(minted);
    setPurchasedAssets(purchased);
    setWhitelistSize(whitelisted);
  };

  useEffect(() => {
    fetchQuantities();
  }, []);

  return { mintedAssets, purchasedAssets, whitelistSize, fetchQuantities };
};
