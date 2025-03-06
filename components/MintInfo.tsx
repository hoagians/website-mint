"use client";

import { Tooltip } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { COLLECTION_SIZE, FEES, TOOLTIP_FEES } from "../app/lib/constants";
import { ACTIVE_INFO_IMG } from "../app/lib/images";
import { MintInfoProps } from "../app/lib/interfaces";
import { getSolanaPrice } from "../app/utils/getSolanaPrice";
import styles from "../styles/mint.module.css";

export const MintInfo: React.FC<MintInfoProps> = ({ numMinted, solPrice }) => {
  const [mintPrice, setMintPrice] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (solPrice === null) return;
    setMintPrice(solPrice);
  }, [solPrice]);

  useEffect(() => {
    if (numMinted === null) return;
    setRemaining(COLLECTION_SIZE - numMinted);
  }, [numMinted]);

  const solanaPrice = getSolanaPrice();

  return (
    <>
      <div className={styles.price}>
        <span>Price</span>
        <span>{mintPrice !== null ? mintPrice === 0 ? "FREE" : `${mintPrice} SOL` : <b>---</b>}</span>
      </div>
      <div className={styles.fees}>
        <span>Transaction fees</span>
        <span>
          <Tooltip
            className={styles.tooltipFees}
            label={solanaPrice ? TOOLTIP_FEES + ` Approximately ${(solanaPrice * FEES).toFixed(2)} USD.` : TOOLTIP_FEES}
            shouldWrapChildren={true}
            placement="top"
            gutter={6}
          >
            <Image className={styles.info} src={ACTIVE_INFO_IMG} alt="" width={13} height={13} priority={true} />
          </Tooltip>
          ~ {FEES} SOL
        </span>
      </div>
      <div className={styles.remaining}>
        <span>Remaining</span>
        <span>{remaining !== null ? remaining > 0 ? remaining : "Sold out" : <b>---</b>}</span>
      </div>
    </>
  );
};
