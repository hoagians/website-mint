"use server";

import {
  COLLECTION,
  MAX_PER_WALLET,
  MINT_LIMIT1,
  MINT_LIMIT2,
  PRICE1,
  PRICE2,
  PRICE3,
  RPC_URL,
  startStage2,
  startStage3,
} from "@/app/lib/constants";
import { createAssetEntry, getAssetsByOwner, getPurchasedAssets } from "@/app/lib/orm/queries/assets";
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
import { getLowestAvailableId } from "../lib/orm/queries/availability";
import { getPartnerStatus } from "../lib/orm/queries/partners";
import { getRecord } from "../lib/orm/queries/records";
import { getWhitelistEntry } from "../lib/orm/queries/whitelist";
import { getLocationFromIp } from "../lib/utils/getLocationFromIp";

const CREATOR1 = String(process.env.NEXT_PUBLIC_CREATOR1);
const CREATOR2 = String(process.env.NEXT_PUBLIC_CREATOR2);

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

  try {
    // console.time("⚪ Time:");
    const [assetId, purchasedAssets, assetsByOwner, whitelistEntry, partnerStatus, locationFromIp, fetchedCollection] =
      await Promise.all([
        getLowestAvailableId(),
        getPurchasedAssets(),
        getAssetsByOwner(owner),
        getWhitelistEntry(owner),
        getPartnerStatus(owner),
        getLocationFromIp(ip),
        fetchCollection(umi, COLLECTION),
      ]);
    // console.timeLog("⚪ Time:");

    id = assetId;
    const { city, country, asOrg, timezone } = locationFromIp;
    const isWhitelisted = whitelistEntry && !whitelistEntry.hasMinted;
    const isPartner = partnerStatus ? true : false;

    const calculatePrice = (purchasedAssets: number) => {
      if (isPartner || isWhitelisted) return 0;
      if (purchasedAssets < MINT_LIMIT1 && NOW < startStage2.getTime()) return PRICE1;
      if (purchasedAssets < MINT_LIMIT1 + MINT_LIMIT2 && NOW < startStage3.getTime()) return PRICE2;
      return PRICE3;
    };

    const price = calculatePrice(purchasedAssets);

    const insertedAsset = await createAssetEntry(assetId, price, assetPublicKey, owner, ip, city, country, asOrg, timezone);

    if (MAX_PER_WALLET <= assetsByOwner) {
      throw new Error("Minting not allowed! This wallet has reached its minting limit.");
    }

    if (partnerStatus) {
      const { quantity, minted, updatedAt } = partnerStatus;

      if (quantity <= minted) {
        throw new Error("Minting not allowed! This wallet has reached its minting limit.");
      }

      const hoursToTheNextMint = 12;
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

    const data = await getRecord(assetId);
    const hash = data?.metadata;

    const tx = await transactionBuilder()
      .add(
        create(umi, {
          name: `Numeral #${assetId}`,
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
      .buildAndSign(umi);

    // Serialize the Transaction
    const serializedTx = umi.transactions.serialize(tx);

    // Encode Uint8Array to String and Return the Transaction to the Frontend
    const serializedTxAsString = base64.deserialize(serializedTx)[0];

    return { id, assetPublicKey, price, isWhitelisted, isPartner, serializedTxAsString };
  } catch (error) {
    // console.error("🔴 Service ERROR [createAssetTx]:", (error as Error).message);
    Sentry.captureException(error);

    return { id, error: error instanceof Error ? (error as Error).message : "Server error. Please try again later." };
  } finally {
    // console.timeEnd("⚪ Time:");
  }
};
