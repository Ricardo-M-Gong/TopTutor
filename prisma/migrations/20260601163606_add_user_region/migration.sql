-- CreateTable
CREATE TABLE "UserRegion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "regionName" TEXT NOT NULL,
    CONSTRAINT "UserRegion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "UserRegion_regionName_idx" ON "UserRegion"("regionName");

-- CreateIndex
CREATE UNIQUE INDEX "UserRegion_userId_regionName_key" ON "UserRegion"("userId", "regionName");
