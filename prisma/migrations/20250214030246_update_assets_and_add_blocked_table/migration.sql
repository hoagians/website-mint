/*
  Warnings:

  - You are about to drop the column `org` on the `Assets` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Assets` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Blocked" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ipAddress" TEXT,
    "city" TEXT,
    "country" TEXT,
    "asOrg" TEXT,
    "timezone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "asset" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "ipAddress" TEXT,
    "city" TEXT,
    "country" TEXT,
    "asOrg" TEXT,
    "timezone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Assets" ("asset", "city", "country", "createdAt", "id", "ipAddress", "owner", "price", "timezone") SELECT "asset", "city", "country", "createdAt", "id", "ipAddress", "owner", "price", "timezone" FROM "Assets";
DROP TABLE "Assets";
ALTER TABLE "new_Assets" RENAME TO "Assets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
