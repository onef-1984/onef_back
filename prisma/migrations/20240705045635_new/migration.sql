/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `coverImage` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[isbn13]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isbn13` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceStandard` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pubDate` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publisher` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_bookId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP CONSTRAINT "Book_pkey",
DROP COLUMN "coverImage",
DROP COLUMN "id",
ADD COLUMN     "cover" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isbn13" TEXT NOT NULL,
ADD COLUMN     "priceStandard" INTEGER NOT NULL,
ADD COLUMN     "pubDate" TEXT NOT NULL,
ADD COLUMN     "publisher" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "bookId",
ADD COLUMN     "bookIsbn" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn13_key" ON "Book"("isbn13");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_bookIsbn_fkey" FOREIGN KEY ("bookIsbn") REFERENCES "Book"("isbn13") ON DELETE SET NULL ON UPDATE CASCADE;
