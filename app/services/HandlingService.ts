"use server";

import * as Sentry from "@sentry/nextjs";
import { HandlerProps } from "../lib/interfaces";
import { deleteAsset } from "../lib/prisma/Assets";
import { updatePartnerStatus } from "../lib/prisma/Partners";
import { getRecord } from "../lib/prisma/Records";
import { updateWhitelistEntry } from "../lib/prisma/Whitelist";
import { getExplorerUrl } from "../utils/helpers";

const DISCORD_MINTING_URL = String(process.env.DISCORD_MINTING_URL);

export const deleteAssetId = async (id: number): Promise<void> => {
  try {
    const deletedAsset = await deleteAsset(id);
    // console.log("🟡 API Response deleting asset:", deletedAsset);
  } catch (error) {
    console.error("🔴 Service ERROR deleting asset:", (error as Error).message);
    Sentry.captureException(error);
  }
};

const postDiscord = async (id: number, assetPublicKey: string) => {
  const explorerUrl = getExplorerUrl(assetPublicKey);

  const text = id === 1 ? "First alien on planet Earth." : "Another alien on planet Earth.";

  const data = await getRecord(id);
  const hash = data?.image;

  const content = {
    content: null,
    embeds: [
      {
        description: "Newly minted Hoagian!",
        color: 5814783,
        fields: [
          {
            name: `Hoagian #${id}`,
            value: `[See on SolanaFM](${explorerUrl})`,
          },
        ],
        footer: {
          text: text,
        },
        image: {
          url: `https://arweave.net/${hash}`,
        },
      },
    ],
    attachments: [],
  };

  return await fetch(DISCORD_MINTING_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
};

export const actionsAfterMint = async ({ assetId, asset, owner, isWhitelisted, isPartner }: HandlerProps): Promise<void> => {
  try {
    const response = await postDiscord(assetId, asset);
    const { status, statusText } = response;
    // console.log("🟡 Service Response handling success [postDiscord]:", { status, statusText });
  } catch (error) {
    console.error("🔴 Service Error handling success [postDiscord]:", (error as Error).message);
    Sentry.captureException(error);
  }

  if (isWhitelisted) {
    try {
      const response = await updateWhitelistEntry(owner);
      // console.log("🟡 Service Response handling success [updateWhitelistEntry]:", response);
    } catch (error) {
      console.error("🔴 Service Error handling success [updateWhitelistEntry]:", (error as Error).message);
      Sentry.captureException(error);
    }
  }

  if (isPartner) {
    try {
      const response = await updatePartnerStatus(owner);
      // console.log("🟡 Service Response handling success [updatePartnerStatus]:", response);
    } catch (error) {
      console.error("🔴 Service Error handling success [updatePartnerStatus]:", (error as Error).message);
      Sentry.captureException(error);
    }
  }
};
