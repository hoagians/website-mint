import prisma from "../prisma";

export const getPartnerStatus = async (walletAddress: string) => {
  return await prisma.partners.findUnique({
    where: { walletAddress },
  });
};

export const updatePartnerStatus = async (walletAddress: string) => {
  return await prisma.partners.update({
    where: { walletAddress },
    data: { minted: { increment: 1 } },
  });
};
