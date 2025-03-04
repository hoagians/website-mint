import prisma from "./Prisma";

export const getRecord = async (id: number) => {
  return await prisma.records.findUnique({
    where: { id },
  });
};
