import prisma from "../prisma";

export const getRecord = async (id: number) => {
  return await prisma.records.findUnique({
    where: { id },
  });
};
