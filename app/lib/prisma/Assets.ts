import prisma from "./Prisma";

export const deleteAsset = async (id: number) => {
  return await prisma.assets.delete({
    where: { id },
  });
};

export const getAssetsByOwner = async (owner: string) => {
  return await prisma.assets.count({
    where: { owner },
  });
};

export const getLastAsset = async () => {
  return await prisma.assets.findFirst({
    orderBy: { id: "desc" },
  });
};

export const getLowestAvailableId = async () => {
  const assets = await prisma.assets.findMany({
    orderBy: { id: "asc" },
  });
  for (let i = 0; i < assets.length; i++) {
    if (assets[i].id !== i + 1) {
      return i + 1;
    }
  }
  return assets.length + 1;
};

export const getMintedAssets = async () => {
  return await prisma.assets.count();
};

export const getMintedAssetsOnStage = async (initialDate: Date, endDate: Date) => {
  return await prisma.assets.count({
    where: {
      createdAt: { gte: initialDate, lte: endDate },
      price: { not: 0 },
    },
  });
};

export const getPurchasedAssets = async () => {
  return await prisma.assets.count({
    where: { price: { not: 0 } },
  });
};

export const getPurchasedAssetsForFree = async () => {
  return await prisma.assets.count({
    where: { price: 0 },
  });
};

export const insertAsset = async (
  id: number,
  price: number,
  asset: string,
  owner: string,
  ipAddress: string,
  city: string,
  country: string,
  asOrg: string,
  timezone: string
) => {
  return await prisma.assets.create({
    data: { id, price, asset, owner, ipAddress, city, country, asOrg, timezone },
  });
};
