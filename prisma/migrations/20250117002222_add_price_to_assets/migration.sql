-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "asset" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "owner" TEXT NOT NULL,
    "ipAddress" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "timezone" TEXT,
    "org" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Assets" ("asset", "city", "country", "createdAt", "id", "ipAddress", "org", "owner", "region", "timezone") SELECT "asset", "city", "country", "createdAt", "id", "ipAddress", "org", "owner", "region", "timezone" FROM "Assets";
DROP TABLE "Assets";
ALTER TABLE "new_Assets" RENAME TO "Assets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
