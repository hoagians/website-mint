"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { CSSProperties } from "react";

export const WalletButton: React.FC = () => {
  const walletButtonStyle: CSSProperties = {
    backgroundColor: "#0a0a0a",
    borderRadius: "8px",
    fontFamily: "system-ui",
    fontSize: "14px",
    height: "50px",
    justifyContent: "center",
    marginTop: "8px",
    textAlign: "center",
    width: "280px",
  };

  return <WalletMultiButton style={walletButtonStyle} />;
};
