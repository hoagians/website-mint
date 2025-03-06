import { startStage1, WHITELIST_SIZE } from "@/app/lib/constants";
import { addWhitelistEntry, getWhitelistSize, verifyWhitelistEntry } from "@/app/lib/prisma/Whitelist";
import * as Sentry from "@sentry/nextjs";
import { PublicKey } from "@solana/web3.js";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const handleDiscordResponse = (message: string) => {
  return NextResponse.json({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: message } });
};

const handleJoinCommand = async (channelId: string, userId: string, walletAddress: string) => {
  try {
    if (startStage1.getTime() <= Date.now()) {
      throw new Error("The whitelist is closed!");
    }

    if (channelId !== "1300315275224158218") {
      throw new Error("This command is not available in this channel!");
    }

    const wallet = new PublicKey(walletAddress);
    if (!PublicKey.isOnCurve(wallet.toBytes())) {
      throw new Error("Invalid wallet address!");
    }

    const whitelistSize = await getWhitelistSize();
    if (whitelistSize >= WHITELIST_SIZE) {
      throw new Error("The whitelist is already full!");
    }

    const result = await verifyWhitelistEntry(userId, walletAddress);
    if (result) {
      throw new Error("You are already whitelisted!");
    }

    const addWhitelist = await addWhitelistEntry(userId, walletAddress);

    return handleDiscordResponse("You have been added to the whitelist!");
  } catch (error) {
    console.error("🔴 API ERROR adding whitelist entry:", (error as Error).message);
    Sentry.captureException(error);
    return handleDiscordResponse((error as Error).message);
  }
};

export async function POST(request: NextRequest) {
  try {
    const { channel, data, member, type } = await request.json();

    if (type === InteractionType.APPLICATION_COMMAND) {
      const { id: channelId } = channel;
      const { id: userId } = member.user;
      const { name, options } = data;
      const walletAddress = options[0].value;

      if (name !== "join") throw new Error("Invalid command!");

      return await handleJoinCommand(channelId, userId, walletAddress);
    }
  } catch (error) {
    console.error("🔴 API ERROR while interacting:", (error as Error).message);
    Sentry.captureException(error);
    return handleDiscordResponse((error as Error).message);
  }
}
