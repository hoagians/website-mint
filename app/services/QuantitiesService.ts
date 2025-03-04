"use server";

import * as Sentry from "@sentry/nextjs";
import { startStage1, startStage3 } from "../lib/constants";
import { Quantities } from "../lib/interfaces";
import { getMintedAssets, getPurchasedAssets } from "../lib/prisma/Assets";
import { getWhitelistSize } from "../lib/prisma/Whitelist";

export const getQuantities = async (): Promise<Quantities> => {
  let whitelisted = null;
  let purchased = null;
  let minted = null;

  const NOW = Date.now();

  if (NOW < startStage1.getTime()) {
    try {
      whitelisted = await getWhitelistSize();
      // console.log("🟡 Service Response fetching quantity [getWhitelistSize]:", whitelisted);
    } catch (error) {
      // console.error("🔴 Service Response fetching quantity [getWhitelistSize]:", (error as Error).message);
      Sentry.captureException(error);
    }
  }

  if (NOW >= startStage1.getTime() && NOW < startStage3.getTime()) {
    try {
      purchased = await getPurchasedAssets();
      // console.log("🟡 Service Response fetching quantity [getPurchasedAssets]:", purchased);
    } catch (error) {
      // console.error("🔴 Service Response fetching quantity [getPurchasedAssets]:", (error as Error).message);
      Sentry.captureException(error);
    }
  }

  if (NOW >= startStage1.getTime()) {
    try {
      minted = await getMintedAssets();
      // console.log("🟡 Service Response fetching quantity [getMintedAssets]:", minted);
    } catch (error) {
      // console.error("🔴 Service Response fetching quantity [getMintedAssets]:", (error as Error).message);
      Sentry.captureException(error);
    }
  }

  return { whitelisted, purchased, minted };
};
