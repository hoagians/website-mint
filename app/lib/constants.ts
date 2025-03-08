// General settings
export const COLLECTION_NAME = "Hoagians"; // Name and username should be the same
export const COLLECTION_DESCRIPTION = `Hoagians is an innovative collection of NFTs with an alien design. Each Hoagian is unique and surprising. Hoagians are the new trend in the market with potential for appreciation. Get your NFT before it’s gone!`;
export const METADATA_DESCRIPTION = `Hoagians is an innovative collection of NFTs with an alien design. Each Hoagian is unique and surprising. Get your NFT before it’s gone!`;

// IDs
export const GTM_ID = "GTM-NWGLGTB6";
export const FB_APP_ID = "1989322008254480";

// URLs
export const BASE_URL = "https://www.hoagians.xyz";
export const RPC_URL = "https://mainnet.helius-rpc.com/?api-key=88eaa316-a3cc-4243-8c7c-5e6ade38a46d";

// Addresses
export const COLLECTION = "Bd8SaGMipU3PWiP7CTKK4Yp6dvA5ndGwH1J14M1AgYYo";
export const CREATOR1 = "6G95Zzxd8cikeY8W8a13A94Wv7SUiksKWq5gvbCoJTuN";
export const CREATOR2 = "BuzEjzpYBL5c48F98KZ4u7T3i9LwWUPwHn6w9bCUdTdE";

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
export const endWhitelist = new Date(Date.UTC(2025, 2, 10));
export const startStage1 = new Date(Date.UTC(2025, 2, 11, 0, 0, 0, 0));
export const daysAfter = 10; // number of days after launch
export const endStage1 = new Date(Date.UTC(2025, 2, 17));
export const startStage2 = new Date(Date.UTC(2025, 2, 18));
export const endStage2 = new Date(Date.UTC(2025, 2, 24));
export const startStage3 = new Date(Date.UTC(2025, 2, 25));

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
export const TOOLTIP_FEES = `This includes Solana rent, token metadata fees, and NFT creation transaction fees.`;
export const TOOLTIP_WL = `At this stage, up to ${WHITELIST_SIZE} wallets can secure a spot on the whitelist to mint 1 NFT for free when sales open. Use our Discord to join the whitelist.`;
export const TOOLTIP_STAGE1 = `At this stage, up to ${MINT_LIMIT1} NFTs can be minted for ${PRICE1} SOL with a limit of ${MAX_PER_WALLET} per wallet.`;
export const TOOLTIP_STAGE2 = `At this stage, up to ${MINT_LIMIT2} NFTs can be minted for ${PRICE2} SOL with a limit of ${MAX_PER_WALLET} per wallet.`;
export const TOOLTIP_STAGE3 = `At this stage, the NFTs can be minted for ${PRICE3} SOL with a limit of ${MAX_PER_WALLET} per wallet.`;
