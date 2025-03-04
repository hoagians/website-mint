"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  TrezorWalletAdapter,
} from "@solana/wallet-adapter-wallets";
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

    if (new SolflareWalletAdapter().readyState !== "Installed") walletsAdapter.push(new SolflareWalletAdapter());
    if (new PhantomWalletAdapter().readyState !== "Installed") walletsAdapter.push(new PhantomWalletAdapter());
    walletsAdapter.push(new LedgerWalletAdapter());
    walletsAdapter.push(new TorusWalletAdapter());
    walletsAdapter.push(new TrezorWalletAdapter());

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
