"use client";

import { Tooltip } from "@chakra-ui/react";
import { addDays, isAfter } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import {
  daysAfter,
  DISCORD_URL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  MAGICEDEN_URL,
  OKX_URL,
  SNIPER_URL,
  startStage1,
  TENSOR_URL,
  X_URL,
} from "../app/lib/constants";
import {
  DISCORD_IMG,
  FACEBOOK_IMG,
  INSTAGRAM_IMG,
  MAGICEDEN_IMG,
  OKX_IMG,
  SNYPER_IMG,
  TENSOR_IMG,
  X_IMG,
} from "../app/lib/images";
import { MediaGroupProps } from "../app/lib/interfaces";
import styles from "../styles/links.module.css";

const MediaGroup: React.FC<MediaGroupProps> = ({ href, src, alt, title, className, size }) => (
  <Link href={href} target="_blank" className={className}>
    <Tooltip className={styles.tooltip} label={title} placement="top" gutter={16}>
      <Image src={src} alt={alt} width={size || 16} height={size || 16} priority={true} />
    </Tooltip>
  </Link>
);

export const Links: React.FC = () => {
  const isEnabled = isAfter(Date.now(), addDays(startStage1, daysAfter));

  const socialLinks = useMemo(
    () => [
      { href: DISCORD_URL, src: DISCORD_IMG, alt: "Link to Discord", title: "View on Discord", size: 17 },
      { href: FACEBOOK_URL, src: FACEBOOK_IMG, alt: "Link to Facebook", title: "View on Facebook", size: 17 },
      // { href: INSTAGRAM_URL, src: INSTAGRAM_IMG, alt: "Link to Instagram", title: "View on Instagram", size: 15 },
      { href: X_URL, src: X_IMG, alt: "Link to X", title: "View on X", size: 12 },
    ],
    []
  );

  const marketLinks = useMemo(
    () => [
      { href: MAGICEDEN_URL, src: MAGICEDEN_IMG, alt: "Link to Magic", title: "View on MagicEden" },
      { href: OKX_URL, src: OKX_IMG, alt: "Link to OKX", title: "View on OKX", size: 23 },
      { href: SNIPER_URL, src: SNYPER_IMG, alt: "Link to Sniper", title: "View on Sniper" },
      { href: TENSOR_URL, src: TENSOR_IMG, alt: "Link to Tensor", title: "View on Tensor" },
    ],
    []
  );

  return (
    <>
      <div className={styles.media}>
        {socialLinks.map((social, index) => (
          <span key={`social-${index}`}>
            <MediaGroup {...social} href={social.href} className={social.href ? styles.link : styles.linkDisabled} />
          </span>
        ))}
      </div>
      <div className={styles.media}>
        {isEnabled ? null : <span className={styles.watermark}>Markets will be available soon</span>}
        {marketLinks.map((market, index) => (
          <span key={`market-${index}`}>
            <MediaGroup
              {...market}
              href={market.href}
              className={isEnabled && market.href ? styles.link : styles.linkDisabled}
            />
          </span>
        ))}
      </div>
    </>
  );
};
