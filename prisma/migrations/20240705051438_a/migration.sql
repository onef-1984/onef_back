/*
  Warnings:

  - You are about to drop the column `bookIsbn` on the `Report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_bookIsbn_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "bookIsbn",
ADD COLUMN     "isbn" TEXT;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "Book"("isbn") ON DELETE SET NULL ON UPDATE CASCADE;
