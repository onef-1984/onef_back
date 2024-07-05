/*
  Warnings:

  - Added the required column `reportType` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('SHORT', 'MIDDLE', 'LONG');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "reportType" "ReportType" NOT NULL;
