/*
  Warnings:

  - You are about to alter the column `price` on the `Assets` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price" REAL NOT NULL,
    "asset" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "ipAddress" TEXT,
    "city" TEXT,
    "country" TEXT,
    "asOrg" TEXT,
    "timezone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Assets" ("asOrg", "asset", "city", "country", "createdAt", "id", "ipAddress", "owner", "price", "timezone") SELECT "asOrg", "asset", "city", "country", "createdAt", "id", "ipAddress", "owner", "price", "timezone" FROM "Assets";
DROP TABLE "Assets";
ALTER TABLE "new_Assets" RENAME TO "Assets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
