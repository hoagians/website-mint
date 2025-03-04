import prisma from "./Prisma";

export const addWhitelistEntry = async (userId: string, walletAddress: string) => {
  return await prisma.whitelist.create({
    data: { userId, walletAddress },
  });
};

export const getWhitelistEntry = async (walletAddress: string) => {
  return await prisma.whitelist.findUnique({
    where: { walletAddress },
  });
};

export const getWhitelistHasMinted = async () => {
  return await prisma.whitelist.count({
    where: { hasMinted: true },
  });
};

export const getWhitelistSize = async () => {
  return await prisma.whitelist.count();
};

export const updateWhitelistEntry = async (walletAddress: string) => {
  return await prisma.whitelist.update({
    where: { walletAddress },
    data: { hasMinted: true },
  });
};

export const verifyWhitelistEntry = async (userId: string, walletAddress: string) => {
  return await prisma.whitelist.findFirst({
    where: {
      OR: [{ userId }, { walletAddress }],
    },
  });
};
