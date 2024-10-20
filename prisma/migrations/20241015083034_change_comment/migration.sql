/*
  Warnings:

  - You are about to drop the column `parentId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `Comment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_reportId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "parentId",
DROP COLUMN "reportId";

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");
