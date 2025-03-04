/*
  Warnings:

  - You are about to drop the column `publicKey` on the `Assets` table. All the data in the column will be lost.
  - Added the required column `asset` to the `Assets` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "asset" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Assets" ("createdAt", "id", "owner") SELECT "createdAt", "id", "owner" FROM "Assets";
DROP TABLE "Assets";
ALTER TABLE "new_Assets" RENAME TO "Assets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
