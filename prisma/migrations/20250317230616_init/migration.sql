-- CreateTable
CREATE TABLE "Assets" (
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

-- CreateTable
CREATE TABLE "Whitelist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "hasMinted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Partners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Records" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "metadata" TEXT NOT NULL,
    "image" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "available" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_walletAddress_key" ON "Whitelist"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Partners_walletAddress_key" ON "Partners"("walletAddress");
