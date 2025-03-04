/*
  Warnings:

  - You are about to drop the column `lastMint` on the `Partners` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Partners" ("id", "quantity", "walletAddress") SELECT "id", "quantity", "walletAddress" FROM "Partners";
DROP TABLE "Partners";
ALTER TABLE "new_Partners" RENAME TO "Partners";
CREATE UNIQUE INDEX "Partners_walletAddress_key" ON "Partners"("walletAddress");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
