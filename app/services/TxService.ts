"use server";

import {
  COLLECTION,
  CREATOR1,
  CREATOR2,
  MAX_PER_WALLET,
  MINT_LIMIT1,
  MINT_LIMIT2,
  PRICE1,
  PRICE2,
  PRICE3,
  RPC_URL,
  startStage2,
  startStage3
} from "@/app/lib/constants";
import {
  getAssetsByOwner,
  getLowestAvailableId,
  getMintedAssets,
  getPurchasedAssets,
  insertAsset,
} from "@/app/lib/prisma/Assets";
import { create, fetchCollection, mplCore } from "@metaplex-foundation/mpl-core";
import { transferSol } from "@metaplex-foundation/mpl-toolbox";
import {
  createNoopSigner,
  createSignerFromKeypair,
  generateSigner,
  publicKey,
  PublicKey,
  signerIdentity,
  sol,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base64 } from "@metaplex-foundation/umi/serializers";
import * as Sentry from "@sentry/nextjs";
import { addHours, differenceInMilliseconds, isAfter } from "date-fns";
import { Base64 } from "js-base64";
import { getPartnerStatus } from "../lib/prisma/Partners";
import { getRecord } from "../lib/prisma/Records";
import { getWhitelistEntry } from "../lib/prisma/Whitelist";
import { getIpLocation } from "../utils/getIpLocation";

const NOW = Date.now();

export const createAssetTx = async (owner: PublicKey, ip: string): Promise<any> => {
  const umi = createUmi(RPC_URL, "processed").use(mplCore());

  const secretKey = Base64.toUint8Array(String(process.env.SECRET_KEY));
  const authority = createSignerFromKeypair(umi, umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey)));
  const creator1 = publicKey(CREATOR1);
  const creator2 = publicKey(CREATOR2);
  const asset = generateSigner(umi);
  const assetPublicKey = asset.publicKey;

  umi.use(signerIdentity(authority));

  let id;
  let price = 0;

  // console.log("🟡 assetPublicKey:", assetPublicKey);
  // console.log("🟡 owner:", owner);
  // console.log("🟡 ip:", ip);

  try {
    console.time("⚪ Time:");

    const [
      fetchedCollection,
      mintedAssets,
      purchasedAssets,
      assetId,
      assetsByOwner,
      whitelistEntry,
      partnerStatus,
      locationFromIp,
    ] = await Promise.all([
      fetchCollection(umi, COLLECTION),
      getMintedAssets(),
      getPurchasedAssets(),
      getLowestAvailableId(),
      getAssetsByOwner(owner),
      getWhitelistEntry(owner),
      getPartnerStatus(owner),
      getIpLocation(ip),
    ]);

    const { city, country, asOrg, timezone } = locationFromIp;
    const isWhitelisted = whitelistEntry && !whitelistEntry.hasMinted;
    const isPartner = partnerStatus ? true : false;

    // console.log("🟡 numMinted:", fetchedCollection.numMinted);
    // console.log("🟡 mintedAssets:", mintedAssets);
    // console.log("🟡 hasMinted:", hasMinted);
    // console.log("🟡 assetId:", assetId);
    // console.log("🟡 assetsByOwner:", assetsByOwner);
    // console.log("🟡 whitelistEntry:", whitelistEntry);
    // console.log("🟡 partnerStatus:", partnerStatus);
    // console.log("🟡 isWhitelisted:", isWhitelisted);
    // console.log("🟡 isPartner:", isPartner);
    // console.log("🟡 locationFromIp:", locationFromIp);

    if (MAX_PER_WALLET <= assetsByOwner) {
      throw new Error("Minting not allowed! This wallet has reached its minting limit.");
    }

    if (partnerStatus) {
      const { quantity, minted, updatedAt } = partnerStatus;

      if (quantity <= minted) {
        throw new Error("Minting not allowed! This wallet has reached its minting limit.");
      }

      const hoursToTheNextMint = 8;
      const canMint = isAfter(NOW, addHours(updatedAt, hoursToTheNextMint));

      if (!canMint) {
        const getTimeUntilNextMint = (lastMint: Date): number => {
          const nextMintTime = addHours(new Date(lastMint), hoursToTheNextMint);
          const currentTime = new Date();
          const diff = differenceInMilliseconds(nextMintTime, currentTime);
          return diff > 0 ? diff : 0;
        };

        const remainingTimeMs = getTimeUntilNextMint(updatedAt);
        const hours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
        throw new Error(
          `This wallet can only mint once every ${hoursToTheNextMint} hours! Please try again in ${hours}h ${minutes}m.`
        );
      }
    }

    const calculatePrice = (purchasedAssets: number) => {
      if (isPartner || isWhitelisted) return 0;
      if (purchasedAssets < MINT_LIMIT1 && NOW < startStage2.getTime()) return PRICE1;
      if (purchasedAssets < MINT_LIMIT1 + MINT_LIMIT2 && NOW < startStage3.getTime()) return PRICE2;
      return PRICE3;
    };

    price = calculatePrice(purchasedAssets);
    // console.log("🟡 price:", price);

    if (fetchedCollection.numMinted === mintedAssets) {
      // console.timeLog("⚪ Time:");
      const insertedAsset = await insertAsset(assetId, price, assetPublicKey, owner, ip, city, country, asOrg, timezone);
      id = insertedAsset.id;
      // console.log("🟡 ID inserted:", id);

      const data = await getRecord(assetId);
      const hash = data?.metadata;

      const createAssetTx = await transactionBuilder()
        .add(
          create(umi, {
            name: `Numeral #${id}`,
            uri: `https://arweave.net/${hash}`,
            asset: asset,
            collection: fetchedCollection,
            authority: authority,
            payer: createNoopSigner(publicKey(owner)),
            owner: owner,
            plugins: [
              {
                type: "VerifiedCreators",
                signatures: [
                  { address: creator1, verified: false },
                  { address: creator2, verified: false },
                ],
                authority: { type: "UpdateAuthority" },
              },
              {
                type: "Royalties",
                basisPoints: 500,
                creators: [
                  { address: creator1, percentage: 0 },
                  { address: creator2, percentage: 100 },
                ],
                ruleSet: { type: "None" },
                authority: { type: "UpdateAuthority" },
              },
            ],
          })
        )
        .add(
          transferSol(umi, {
            source: createNoopSigner(publicKey(owner)),
            destination: creator1,
            amount: sol(price),
          })
        )
        .useV0()
        .setBlockhash(await umi.rpc.getLatestBlockhash({ signal: AbortSignal.timeout(10000) }))
        .buildAndSign(umi);

      // console.timeLog("⚪ Time:");

      // Serialize the Transaction
      const serializedTx = umi.transactions.serialize(createAssetTx);

      // Encode Uint8Array to String and Return the Transaction to the Frontend
      const serializedTxAsString = base64.deserialize(serializedTx)[0];

      // Decode the String to Uint8Array to make it usable
      // const deserializedTxAsU8 = base64.serialize(serializedTxAsString);

      // Deserialize the Transaction returned by the Backend
      // const deserializedTx = umi.transactions.deserialize(deserializedTxAsU8);

      // console.log("🟡 Service Response getting tx:", {
      //   id,
      //   assetPublicKey,
      //   price,
      //   isWhitelisted,
      //   isPartner,
      //   serializedTxAsString,
      // });
      return { id, assetPublicKey, price, isWhitelisted, isPartner, serializedTxAsString };
    } else {
      throw new Error("Network busy! Please try again shortly.");
    }
  } catch (error) {
    // console.error("🔴 Service ERROR getting tx:", (error as Error).message);
    Sentry.captureException(error);
  } finally {
    console.timeEnd("⚪ Time:");
  }
};
