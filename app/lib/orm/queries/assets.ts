import prisma from "../prisma";

export const createAssetEntry = async (
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

export const getAssetsByOwner = async (owner: string) => {
  return await prisma.assets.count({
    where: { owner },
  });
};

export const getMintedAssets = async () => {
  return await prisma.assets.count();
};

export const getPurchasedAssets = async () => {
  return await prisma.assets.count({
    where: { price: { not: 0 } },
  });
};

export const deleteAsset = async (id: number) => {
  return await prisma.assets.delete({
    where: { id },
  });
};
