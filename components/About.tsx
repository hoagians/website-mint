"use client";

import { Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import { COLLECTION, COLLECTION_DESCRIPTION } from "../app/lib/constants";
import { getExplorerUrl, transformString } from "../app/utils/helpers";
import styles from "../styles/about.module.css";

export const About: React.FC = () => {
  const explorerUrl = getExplorerUrl(COLLECTION);
  const shortString = transformString(COLLECTION);

  return (
    <>
      <div className={styles.address}>
        <span>Collection address</span>
        <span>
          <Link href={explorerUrl} target="_black">
            <Tooltip className={styles.tooltip} label="View on SolanaFM" placement="top" gutter={8}>
              <span>{shortString}</span>
            </Tooltip>
          </Link>
        </span>
      </div>
      <div className={styles.description}>
        <p>{COLLECTION_DESCRIPTION}</p>
      </div>
    </>
  );
};
