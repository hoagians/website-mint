/*
  Warnings:

  - Made the column `updatedAt` on table `Partners` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Whitelist` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Partners" ("createdAt", "id", "quantity", "updatedAt", "walletAddress") SELECT "createdAt", "id", "quantity", "updatedAt", "walletAddress" FROM "Partners";
DROP TABLE "Partners";
ALTER TABLE "new_Partners" RENAME TO "Partners";
CREATE UNIQUE INDEX "Partners_walletAddress_key" ON "Partners"("walletAddress");
CREATE TABLE "new_Whitelist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "hasMinted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Whitelist" ("createdAt", "hasMinted", "id", "updatedAt", "userId", "walletAddress") SELECT "createdAt", "hasMinted", "id", "updatedAt", "userId", "walletAddress" FROM "Whitelist";
DROP TABLE "Whitelist";
ALTER TABLE "new_Whitelist" RENAME TO "Whitelist";
CREATE UNIQUE INDEX "Whitelist_walletAddress_key" ON "Whitelist"("walletAddress");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
