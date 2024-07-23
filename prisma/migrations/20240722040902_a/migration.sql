/*
  Warnings:

  - You are about to drop the column `category` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `isbn` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `page` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `isbn` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reportType` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[isbn13]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryName` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerReviewRank` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isbn13` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subInfoId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_isbn_fkey";

-- DropIndex
DROP INDEX "Book_isbn_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "category",
DROP COLUMN "isbn",
DROP COLUMN "page",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "categoryName" TEXT NOT NULL,
ADD COLUMN     "customerReviewRank" INTEGER NOT NULL,
ADD COLUMN     "isbn13" TEXT NOT NULL,
ADD COLUMN     "subInfoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "isbn",
DROP COLUMN "reportType",
ADD COLUMN     "isbn13" TEXT;

-- DropEnum
DROP TYPE "ReportType";

-- CreateTable
CREATE TABLE "SubInfo" (
    "id" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "itemPage" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "sizeDepth" INTEGER NOT NULL,
    "sizeHeight" INTEGER NOT NULL,
    "sizeWidth" INTEGER NOT NULL,

    CONSTRAINT "SubInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn13_key" ON "Book"("isbn13");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_isbn13_fkey" FOREIGN KEY ("isbn13") REFERENCES "Book"("isbn13") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_subInfoId_fkey" FOREIGN KEY ("subInfoId") REFERENCES "SubInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
