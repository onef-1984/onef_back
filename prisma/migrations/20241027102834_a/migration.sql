/*
  Warnings:

  - The values [LIKE,COMMENT,WELCOME] on the enum `NotiType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `eventId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotiType_new" AS ENUM ('NEW_COMMENT_ON_REPORT', 'NEW_LIKE_ON_REPORT');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotiType_new" USING ("type"::text::"NotiType_new");
ALTER TYPE "NotiType" RENAME TO "NotiType_old";
ALTER TYPE "NotiType_new" RENAME TO "NotiType";
DROP TYPE "NotiType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "eventId" TEXT NOT NULL,
ADD COLUMN     "isVirgin" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
