// General settings
export const COLLECTION_NAME = "Hoagians"; // Name and username should be the same
export const COLLECTION_DESCRIPTION = `Hoagians is an innovative collection of NFTs with an alien design. Each Hoagian is unique and surprising. Hoagians are the new trend in the market with potential for appreciation. Get your NFT before it’s gone!`;
export const METADATA_DESCRIPTION = `Hoagians is an innovative collection of NFTs with an alien design. Each Hoagian is unique and surprising. Get your NFT before it’s gone!`;

// URLs
export const BASE_URL = String(process.env.NEXT_PUBLIC_BASE_URL);
export const RPC_URL = String(process.env.NEXT_PUBLIC_RPC_URL);

// Addresses
export const COLLECTION = String(process.env.NEXT_PUBLIC_COLLECTION);
export const CREATOR1 = String(process.env.NEXT_PUBLIC_CREATOR1);
export const CREATOR2 = String(process.env.NEXT_PUBLIC_CREATOR2);

// Quantities
export const MAX_PER_WALLET = 20;
export const WHITELIST_SIZE = 500;
export const MINT_LIMIT1 = 1500;
export const MINT_LIMIT2 = 2000;
export const COLLECTION_SIZE = 7777;

// Price
export const FEES = 0.005;
export const PRICE1 = 0.01;
export const PRICE2 = 0.02;
export const PRICE3 = 0.03;

// Dates
export const endWhitelist = new Date(Date.UTC(2025, 2, 8));
export const startStage1 = new Date(Date.UTC(2025, 2, 9, 0, 0, 0, 0));
export const daysAfter = 10; // number of days after launch
export const endStage1 = new Date(Date.UTC(2025, 2, 15));
export const startStage2 = new Date(Date.UTC(2025, 2, 16));
export const endStage2 = new Date(Date.UTC(2025, 2, 22));
export const startStage3 = new Date(Date.UTC(2025, 2, 23));

// Social media
export const DISCORD_URL = "https://discord.com/";
export const FACEBOOK_URL = "https://www.facebook.com/";
export const INSTAGRAM_URL = "https://www.instagram.com/";
export const X_URL = "https://x.com/";

// Marketplaces
export const MAGICEDEN_URL = "https://magiceden.io/";
export const OKX_URL = "https://www.okx.com/";
export const SNIPER_URL = "https://www.sniper.xyz/";
export const TENSOR_URL = "https://tensor.trade/";

// Tooltips
export const TOOLTIP_FEES = `This includes the Solana rental cost, the token metadata fee, and the transaction fee to create a new NFT.`;
export const TOOLTIP_WL = `At this stage, up to ${WHITELIST_SIZE} wallets can register for the whitelist to mint 1 NFT for free when sales open. Use Discord to join the whitelist!`;
export const TOOLTIP_STAGE1 = `At this stage, up to ${MINT_LIMIT1} NFTs can be minted for ${PRICE1} SOL with a limit of ${MAX_PER_WALLET} per wallet.`;
export const TOOLTIP_STAGE2 = `At this stage, up to ${MINT_LIMIT2} NFTs can be minted for ${PRICE2} SOL with a limit of ${MAX_PER_WALLET} per wallet.`;
export const TOOLTIP_STAGE3 = `At this stage, the NFTs can be minted for ${PRICE3} SOL with a limit of ${MAX_PER_WALLET} per wallet.`;
