import prisma from "../prisma";

export const getLowestAvailableId = async () => {
  const result = await prisma.$queryRaw<{ id: number }[]>`
      UPDATE Availability
      SET available = false
      WHERE id = (
        SELECT id
        FROM Availability
        WHERE available = true
        ORDER BY id ASC
        LIMIT 1
      )
      RETURNING id;
    `;

  return (result[0] as { id: number }).id;
};

export const updateAvailableId = async (id: number) => {
  return await prisma.availability.update({
    where: { id },
    data: { available: true },
  });
};
