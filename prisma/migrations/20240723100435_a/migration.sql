/*
  Warnings:

  - You are about to drop the `Noti` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Noti" DROP CONSTRAINT "Noti_userId_fkey";

-- DropTable
DROP TABLE "Noti";

-- CreateTable
CREATE TABLE "Notify" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notify_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notify_userId_key" ON "Notify"("userId");

-- AddForeignKey
ALTER TABLE "Notify" ADD CONSTRAINT "Notify_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
