"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import React, { useMemo } from "react";
import { RPC_URL } from "../app/lib/constants";
import "../styles/styles.css";
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { clusterApiUrl } from "@solana/web3.js";

export default function WalletProviderApp({ children }: { children: React.ReactNode }) {
  // const network = WalletAdapterNetwork.Devnet;
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => {
    const walletsAdapter = [];

    if (new PhantomWalletAdapter().readyState !== "Installed") walletsAdapter.push(new PhantomWalletAdapter());
    // if (new SolflareWalletAdapter().readyState !== "Installed") walletsAdapter.push(new SolflareWalletAdapter());

    return walletsAdapter;
  }, []);

  return (
    <ConnectionProvider endpoint={RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
