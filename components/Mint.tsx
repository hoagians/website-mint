"use client";

import { mplCore } from "@metaplex-foundation/mpl-core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { base64 } from "@metaplex-foundation/umi/serializers";
import { sendGTMEvent } from "@next/third-parties/google";
import * as Sentry from "@sentry/nextjs";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { addMinutes, isWithinInterval, subMinutes } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { startStage1, startStage2, startStage3 } from "../app/lib/constants";
import { HandlerProps, MintProps } from "../app/lib/interfaces";
import { getExplorerUrl } from "../app/lib/utils/getExplorerUrl";
import { getIpAddress } from "../app/lib/utils/getIpAddress";
import { actionsAfterError } from "../app/services/ServiceAfterError";
import { actionsAfterMint } from "../app/services/ServiceAfterMint";
import { txBuilder } from "../app/services/TxBuilderService";
import styles from "../styles/mint.module.css";
import { Countdown } from "./Countdown";
import { MintInfo } from "./MintInfo";
import { WalletButton } from "./WalletButton";

const isNowWithinInterval = (date: Date): boolean => {
  const NOW = Date.now();
  const startDate = subMinutes(date, 5);
  const endDate = addMinutes(date, 5);
  return isWithinInterval(NOW, { start: startDate, end: endDate });
};

export const Mint: React.FC<MintProps> = ({ numMinted, solPrice, onNumMintedChange, onQuantityChange }) => {
  const walletAdapter = useWallet();
  const { publicKey } = walletAdapter;
  const { connection } = useConnection();

  const umi = createUmi(connection).use(mplCore());

  const [enabled, setEnabled] = useState<boolean>(startStage1.getTime() < Date.now());
  const [formMessage, setFormMessage] = useState<string | JSX.Element | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mintPrice, setMintPrice] = useState<number | null>(null);
  const [numMintedAssets, setNumMintedAssets] = useState<number | null>(null);
  const [spinner, setSpinner] = useState<boolean>(true);

  useEffect(() => {
    if (numMinted === null || solPrice === null) return;
    setMintPrice(solPrice);
    setNumMintedAssets(numMinted);
    setIsLoading(false);
    setSpinner(false);
  }, [numMinted, solPrice]);

  const handleMintSuccess = useCallback(
    async ({ assetId, price, asset, owner, ipAddress, isWhitelisted, isPartner }: HandlerProps) => {
      const explorerUrl = getExplorerUrl(asset);

      setFormMessage(
        <span>
          Success! View on{" "}
          <a target="_blank" title="Link to SolanaFM" href={explorerUrl} rel="noopener noreferrer">
            SolanaFM
          </a>
          .
        </span>
      );

      setTimeout(() => setFormMessage(null), 14000);

      try {
        await actionsAfterMint({ assetId, price, asset, owner, ipAddress, isWhitelisted, isPartner });
      } catch (error) {
        Sentry.captureException(error);
      }

      sendGTMEvent({
        event: "purchase",
        transaction_id: String(assetId),
        value: price,
        currency: "USD",
        items: [{ item_id: String(assetId), item_name: String(assetId) }],
      });

      Sentry.withIsolationScope(() => {
        Sentry.setTag("assetId", assetId);
        Sentry.setTag("nft", asset);
        Sentry.setTag("owner", owner);
        Sentry.captureMessage(`MintedAsset`);
      });
    },
    []
  );

  const handleMintError = useCallback(async (error: Error | string, id?: number) => {
    setFormMessage(typeof error === "string" ? error : error.message);

    setTimeout(() => setFormMessage(null), 8000);

    try {
      if (typeof id === "number") await actionsAfterError(id);
    } catch (error) {
      Sentry.captureException(error);
    }

    Sentry.captureException(new Error(typeof error === "string" ? error : error.message));
  }, []);

  const handleMint = useCallback(async () => {
    let anyError = null;
    let assetId;

    try {
      setSpinner(true);

      if (!publicKey) throw new Error("Wallet not connected!");
      umi.use(walletAdapterIdentity(walletAdapter, true));

      if (umi.identity.publicKey !== String(process.env.NEXT_PUBLIC_AUTHORITY))
        throw new Error("Minting not allowed! Please wait, under construction.");

      const solBalance = await connection.getBalance(publicKey).then((balance) => balance / 1e9);
      if (solPrice && solBalance < solPrice) throw new Error("Insufficient balance!");

      const ipAddress = await getIpAddress();
      const owner = publicKey.toString();

      const result = await txBuilder(umi.identity.publicKey);
      const { id, asset, price, isWhitelisted, isPartner, serializedTxAsString, error } = result;

      assetId = id;

      if (error) throw new Error(error);
      if (price === 0) setMintPrice(price);

      // Decode the String to Uint8Array to make it usable
      const deserializedTxAsU8 = base64.serialize(serializedTxAsString);

      // Deserialize the Transaction returned by the Backend
      const deserializedTx = umi.transactions.deserialize(deserializedTxAsU8);

      const timeout = () => {
        return new Promise<void>((_, reject) => {
          setTimeout(() => reject("Transaction expired! Please try again."), 30000);
        });
      };

      // Sign the Transaction with timout
      const signedTx = await Promise.race([umi.identity.signTransaction(deserializedTx), timeout()]);
      if (!signedTx) throw new Error("Transaction signing failed! Please try again.");

      // Send the Transaction to the Solana Network
      const txSignature = await umi.rpc.sendTransaction(signedTx);
      if (!txSignature) throw new Error("Transaction failed! Please try again.");

      // Confirm the Transaction on the Solana Network
      const txResult = await umi.rpc.confirmTransaction(txSignature, {
        strategy: { type: "blockhash", ...(await umi.rpc.getLatestBlockhash()) },
      });
      if (txResult.value.err) throw new Error("Transaction failed! Please try again.");

      handleMintSuccess({ assetId, price, asset, owner, ipAddress, isWhitelisted, isPartner });
    } catch (error) {
      anyError = error;
      handleMintError(error as Error | string, assetId);
    } finally {
      setMintPrice(solPrice);
      if (!anyError) onNumMintedChange(assetId);
      if (isNowWithinInterval(startStage2) || isNowWithinInterval(startStage3)) onQuantityChange();
      setSpinner(false);
    }
  }, [connection, publicKey, onNumMintedChange]);

  return (
    <>
      <MintInfo numMinted={numMintedAssets} solPrice={mintPrice} />
      <div style={{ position: "relative", width: "100%" }}>
        <button
          onClick={() => {
            sendGTMEvent({ event: "begin_checkout", value: mintPrice, currency: "USD" });
            handleMint();
          }}
          style={{ height: "50px", width: "100%" }}
          disabled={!enabled || !publicKey || spinner || numMintedAssets === 7777}
        >
          Mint
        </button>
        {spinner && <span className={styles.spinner}></span>}
      </div>
      {isLoading ? (
        <div className={styles.skeleton} />
      ) : enabled ? (
        <WalletButton />
      ) : (
        <Countdown onEnabledChange={(value) => setEnabled(value)} />
      )}
      {formMessage && <div className={styles.message}>{formMessage}</div>}
    </>
  );
};
