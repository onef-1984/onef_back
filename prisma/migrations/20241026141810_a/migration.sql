/*
  Warnings:

  - You are about to drop the `Notify` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NotiType" AS ENUM ('LIKE', 'COMMENT', 'WELCOME');

-- DropForeignKey
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_userId_fkey";

-- DropTable
DROP TABLE "Notify";

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotiType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_key" ON "Notification"("userId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
