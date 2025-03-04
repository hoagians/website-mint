-- CreateTable
CREATE TABLE "Partners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Partners_walletAddress_key" ON "Partners"("walletAddress");
