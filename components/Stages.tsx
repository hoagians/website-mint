"use client";

import { Tooltip } from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  endStage1,
  endStage2,
  endWhitelist,
  MINT_LIMIT1,
  MINT_LIMIT2,
  PRICE1,
  PRICE2,
  PRICE3,
  startStage1,
  startStage2,
  startStage3,
  TOOLTIP_STAGE1,
  TOOLTIP_STAGE2,
  TOOLTIP_STAGE3,
  TOOLTIP_WL,
  WHITELIST_SIZE,
} from "../app/lib/constants";
import { ACTIVE_INFO_IMG, INACTIVE_INFO_IMG } from "../app/lib/images";
import { StageProps, StagesProps } from "../app/lib/interfaces";
import styles from "../styles/stages.module.css";

const StageBlock = ({ isActive, title, date, price, tooltip, mintLimit, hasBorder = true, padding }: StageProps) => (
  <div style={{ borderBottom: hasBorder ? "1px solid #444" : "none", padding: padding }}>
    <div className={isActive ? styles.titleActive : styles.titleInactive}>
      <span>
        <span>{title}</span>
      </span>
      <span>{date}</span>
    </div>
    <div className={isActive ? styles.descriptionActive : styles.descriptionInactive}>
      <span>
        <span>
          <Tooltip className={styles.tooltip} label={tooltip} shouldWrapChildren placement="top-start" gutter={21}>
            <Image
              className={styles.info}
              src={isActive ? ACTIVE_INFO_IMG : INACTIVE_INFO_IMG}
              alt=""
              width={13}
              height={13}
              priority={true}
            />
          </Tooltip>
        </span>
        {price}
      </span>
      {typeof mintLimit === "number" ? <span>Mint Limit: {mintLimit}</span> : <span>{mintLimit}</span>}
    </div>
  </div>
);

export const Stages: React.FC<StagesProps> = ({ purchasedAssets, whitelistSize }) => {
  const [purchased, setPurchased] = useState<number | null>(null);
  const [whitelisted, setWhitelisted] = useState<number | null>(null);

  const [isWhitelistingActive, setIsWhitelistingActive] = useState<boolean>(false);
  const [isStage1Active, setIsStage1Active] = useState<boolean>(false);
  const [isStage2Active, setIsStage2Active] = useState<boolean>(false);

  const NOW = Date.now();

  useEffect(() => {
    if (purchasedAssets === null) return;
    setPurchased(purchasedAssets);
  }, [purchasedAssets]);

  useEffect(() => {
    if (whitelistSize === null) return;
    setWhitelisted(whitelistSize);
  }, [whitelistSize]);

  useEffect(() => {
    if (whitelisted === null) return;
    const hasQuantity = whitelisted < WHITELIST_SIZE;
    const isWhitelisting = NOW < startStage1.getTime();
    setIsWhitelistingActive(hasQuantity && isWhitelisting);
  }, [whitelisted, WHITELIST_SIZE, startStage1]);

  useEffect(() => {
    if (purchased === null) return;
    const hasQuantity = purchased < MINT_LIMIT1;
    const isStage1 = NOW < startStage2.getTime();
    setIsStage1Active(hasQuantity && isStage1);
  }, [purchased, MINT_LIMIT1, startStage2]);

  useEffect(() => {
    if (purchased === null) return;
    const hasQuantity = purchased < MINT_LIMIT1 + MINT_LIMIT2;
    const isStage2 = NOW < startStage3.getTime();
    setIsStage2Active(hasQuantity && isStage2);
  }, [purchased, MINT_LIMIT1, MINT_LIMIT2, startStage3]);

  const endWlMonth = endWhitelist.toLocaleString("en-US", { month: "short" });
  const endWlDay = endWhitelist.getUTCDate();

  const startS1Month = startStage1.toLocaleString("en-US", { month: "short" });
  const startS1Day = startStage1.getUTCDate();
  const endS1Month = endStage1.toLocaleString("en-US", { month: "short" });
  const endS1Day = endStage1.getUTCDate();
  const endS1Date = startS1Month === endS1Month ? endS1Day : `${endS1Month} ${endS1Day}`;

  const startS2Month = startStage2.toLocaleString("en-US", { month: "short" });
  const startS2Day = startStage2.getUTCDate();
  const endS2Month = endStage2.toLocaleString("en-US", { month: "short" });
  const endS2Day = endStage2.getUTCDate();
  const endS2Date = startS2Month === endS2Month ? endS2Day : `${endS2Month} ${endS2Day}`;

  const startS3Month = startStage3.toLocaleString("en-US", { month: "short" });
  const startS3Day = startStage3.getUTCDate();

  return (
    <>
      <StageBlock
        isActive={isWhitelistingActive}
        title="Whitelisting:"
        date={`until ${endWlMonth} ${endWlDay} UTC`}
        price="Price: Free"
        tooltip={TOOLTIP_WL}
        mintLimit={WHITELIST_SIZE}
        padding="0 0 5px"
      />
      <StageBlock
        isActive={isStage1Active}
        title="Sales Stage 1:"
        date={`${startS1Month} ${startS1Day}-${endS1Date} UTC`}
        price={`Price: ${PRICE1} SOL`}
        tooltip={TOOLTIP_STAGE1}
        mintLimit={MINT_LIMIT1}
        padding="5px 0"
      />
      <StageBlock
        isActive={isStage2Active}
        title="Sales Stage 2:"
        date={`${startS2Month} ${startS2Day}-${endS2Date} UTC`}
        price={`Price: ${PRICE2} SOL`}
        tooltip={TOOLTIP_STAGE2}
        mintLimit={MINT_LIMIT2}
        padding="5px 0"
      />
      <StageBlock
        isActive={true}
        title="Sales Stage 3:"
        date={`from ${startS3Month} ${startS3Day} UTC`}
        price={`Price: ${PRICE3} SOL`}
        tooltip={TOOLTIP_STAGE3}
        mintLimit="all NFTs"
        hasBorder={false}
        padding="5px 0 0"
      />
    </>
  );
};
