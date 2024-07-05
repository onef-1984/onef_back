/*
  Warnings:

  - You are about to drop the column `isbn13` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[isbn]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isbn` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_bookIsbn_fkey";

-- DropIndex
DROP INDEX "Book_isbn13_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "isbn13",
ADD COLUMN     "isbn" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_bookIsbn_fkey" FOREIGN KEY ("bookIsbn") REFERENCES "Book"("isbn") ON DELETE SET NULL ON UPDATE CASCADE;
