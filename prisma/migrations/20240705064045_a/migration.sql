/*
  Warnings:

  - Made the column `category` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "category" SET NOT NULL;
