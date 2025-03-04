-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "lastMint" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Partners" ("id", "lastMint", "quantity", "walletAddress") SELECT "id", coalesce("lastMint", CURRENT_TIMESTAMP) AS "lastMint", "quantity", "walletAddress" FROM "Partners";
DROP TABLE "Partners";
ALTER TABLE "new_Partners" RENAME TO "Partners";
CREATE UNIQUE INDEX "Partners_walletAddress_key" ON "Partners"("walletAddress");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
