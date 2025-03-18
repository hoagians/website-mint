"use server";

import * as Sentry from "@sentry/nextjs";
import { startStage1, startStage3 } from "../lib/constants";
import { Quantities } from "../lib/interfaces";
import { getMintedAssets, getPurchasedAssets } from "../lib/orm/queries/assets";
import { getWhitelistSize } from "../lib/orm/queries/whitelist";

export const getQuantities = async (): Promise<Quantities> => {
  let whitelisted = 0;
  let purchased = 0;
  let minted = 0;

  const NOW = Date.now();

  try {
    if (NOW < startStage1.getTime()) {
      whitelisted = await getWhitelistSize();
      // console.log("🟡 Service Response [getWhitelistSize]:", whitelisted);
    }

    if (startStage1.getTime() <= NOW && NOW < startStage3.getTime()) {
      purchased = await getPurchasedAssets();
      // console.log("🟡 Service Response [getPurchasedAssets]:", purchased);
    }

    if (startStage1.getTime() <= NOW) {
      minted = await getMintedAssets();
      // console.log("🟡 Service Response [getMintedAssets]:", minted);
    }
  } catch (error) {
    // console.error("🔴 Service Response [getQuantities]:", (error as Error).message);
    Sentry.captureException(error);
    throw new Error("Server error. Please try again later.");
  }

  return { whitelisted, purchased, minted };
};
