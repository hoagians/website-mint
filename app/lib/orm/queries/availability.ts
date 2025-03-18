import prisma from "../prisma";

export const getLowestAvailableId = async () => {
  return await prisma.$transaction(async (prisma) => {
    const availability = await prisma.availability.findFirst({
      where: { available: true },
      orderBy: { id: "asc" },
    });

    if (!availability) throw new Error("No available ID found");

    const id = availability.id;

    const result = await prisma.availability.update({
      where: { id },
      data: { available: false },
    });

    return result.id;
  });
};

export const updateAvailableId = async (id: number) => {
  return await prisma.availability.update({
    where: { id },
    data: { available: true },
  });
};
