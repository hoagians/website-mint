-- CreateTable
CREATE TABLE "Assets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicKey" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Whitelist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "hasMinted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_walletAddress_key" ON "Whitelist"("walletAddress");
