-- CreateTable
CREATE TABLE "UserHash" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    CONSTRAINT "UserHash_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSalt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "salt" TEXT NOT NULL,
    CONSTRAINT "UserSalt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserHash_userId_key" ON "UserHash"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSalt_userId_key" ON "UserSalt"("userId");
