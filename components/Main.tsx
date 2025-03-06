"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  COLLECTION_NAME,
  MINT_LIMIT1,
  MINT_LIMIT2,
  PRICE1,
  PRICE2,
  PRICE3,
  startStage2,
  startStage3,
} from "../app/lib/constants";
import { TabLinkProps } from "../app/lib/interfaces";
import { Tab } from "../app/lib/types";
import { useQuantities } from "../hooks/useQuantities";
import { About } from "./About";
import { Carousel } from "./Carousel";
import { Links } from "./Links";
import { Mint } from "./Mint";
import { Stages } from "./Stages";

const TabLink = ({ label, activeTab, isMobile, setActiveTab }: TabLinkProps) => (
  <Link
    style={{
      color: activeTab === label ? (isMobile ? "limegreen" : "lime") : "white",
      borderBottom: activeTab === label ? (isMobile ? "1px solid limegreen" : "1px solid lime") : "",
      fontSize: "16px",
      fontWeight: "normal",
      marginRight: "12px",
      padding: "8px 8px",
    }}
    onClick={() => {
      setActiveTab(label);
      sendGTMEvent({ event: "select_content", content_type: String(label) });
    }}
    href={""}
  >
    {label.charAt(0).toUpperCase() + label.slice(1)}
  </Link>
);

export const Main: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("mint");
  const [isMobile, setIsMobile] = useState(false);
  const [mintPrice, setMintPrice] = useState<number | null>(null);
  const [numMintedAssets, setNumMintedAssets] = useState<number | null>(null);

  const isMobileDevice = useMediaQuery({ maxWidth: 1200 });
  const { whitelistSize, purchasedAssets, mintedAssets, fetchQuantities } = useQuantities();

  const NOW = Date.now();

  useEffect(() => {
    setIsMobile(isMobileDevice);
  }, [isMobileDevice]);

  useEffect(() => {
    setNumMintedAssets(mintedAssets);
  }, [mintedAssets]);

  useEffect(() => {
    if (purchasedAssets === null) return;
    const calculatePrice = (purchasedAssets: number) => {
      if (purchasedAssets < MINT_LIMIT1 && NOW < startStage2.getTime()) return PRICE1;
      if (purchasedAssets < MINT_LIMIT1 + MINT_LIMIT2 && NOW < startStage3.getTime()) return PRICE2;
      return PRICE3;
    };

    const price = calculatePrice(purchasedAssets);
    setMintPrice(price);
  }, [purchasedAssets, startStage2, startStage3]);

  return (
    <main>
      <div className="container">
        <Carousel />
        <div style={{ display: "flex", flexDirection: "column", minWidth: "320px" }}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <h1 style={{ fontSize: "36px", margin: "0" }}>{COLLECTION_NAME.toUpperCase()}</h1>
            <sup className="sup">©</sup>
          </div>
          {/* Tabs with underlining // ...(NOW < startStage3.getTime() ? ["stages"] : []) */}
          <div style={{ margin: "6px 0", borderBottom: "1px solid #555555", paddingBottom: "8px" }}>
            {["mint", "about", "stages", "links"].map((tab) => (
              <TabLink key={tab} label={tab as Tab} activeTab={activeTab} isMobile={isMobile} setActiveTab={setActiveTab} />
            ))}
          </div>
          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "mint" && (
              <Mint
                numMinted={numMintedAssets}
                solPrice={mintPrice}
                onNumMintedChange={(value) => setNumMintedAssets(value)}
                onQuantityChange={() => fetchQuantities()}
              />
            )}
            {activeTab === "about" && <About />}
            {activeTab === "stages" && <Stages purchasedAssets={purchasedAssets} whitelistSize={whitelistSize} />}
            {activeTab === "links" && <Links />}
          </div>
          {/* <footer className="footer">© {new Date().getFullYear()} Hoagians</footer> */}
        </div>
      </div>
    </main>
  );
};
