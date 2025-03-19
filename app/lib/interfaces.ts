import { Tab } from "./types";

export interface CountdownProps {
  onEnabledChange: (value: boolean) => void;
}

export interface CustomLocation {
  city: string;
  country: string;
  asOrg: string;
  timezone: string;
}

export interface HandlerProps {
  assetId: number;
  price: number;
  asset: string;
  owner: string;
  ipAddress: string;
  isWhitelisted: boolean;
  isPartner: boolean;
}

export interface MediaGroupProps {
  href: string;
  src: string;
  alt: string;
  title: string;
  className: string;
  size?: number;
}

export interface MintInfoProps {
  numMinted: number | null;
  solPrice: number | null;
}

export interface MintProps {
  numMinted: number | null;
  solPrice: number | null;
  onNumMintedChange: (numMinted: number) => void;
  onQuantityChange: () => void;
}

export interface Quantities {
  whitelisted: number | null;
  purchased: number | null;
  minted: number | null;
}

export interface StagesProps {
  purchasedAssets: number | null;
  whitelistSize: number | null;
}

export interface StageProps {
  isActive: boolean;
  title: string;
  date: string;
  price: string;
  tooltip?: string;
  mintLimit?: number | string;
  hasBorder?: boolean;
  padding?: string;
}

export interface TabLinkProps {
  label: Tab;
  activeTab: Tab;
  isMobile: boolean;
  setActiveTab: (tab: Tab) => void;
}
