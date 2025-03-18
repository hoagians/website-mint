"use server";

import * as Sentry from "@sentry/nextjs";
import { HandlerProps } from "../lib/interfaces";
import { updatePartnerStatus } from "../lib/orm/queries/partners";
import { getRecord } from "../lib/orm/queries/records";
import { updateWhitelistEntry } from "../lib/orm/queries/whitelist";
import { getExplorerUrl } from "../lib/utils/getExplorerUrl";

const DISCORD_MINTING_URL = String(process.env.DISCORD_MINTING_WEBHOOK_URL);

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
    // console.log("🟡 Service Response [postDiscord]:", { status, statusText });
  } catch (error) {
    // console.error("🔴 Service Error [postDiscord]:", (error as Error).message);
    Sentry.captureException(error);
  }

  if (isWhitelisted) {
    try {
      const response = await updateWhitelistEntry(owner);
      // console.log("🟡 Service Response [updateWhitelistEntry]:", response);
    } catch (error) {
      // console.error("🔴 Service Error [updateWhitelistEntry]:", (error as Error).message);
      Sentry.captureException(error);
    }
  }

  if (isPartner) {
    try {
      const response = await updatePartnerStatus(owner);
      // console.log("🟡 Service Response [updatePartnerStatus]:", response);
    } catch (error) {
      // console.error("🔴 Service Error [updatePartnerStatus]:", (error as Error).message);
      Sentry.captureException(error);
    }
  }
};
