/*
  Warnings:

  - You are about to drop the `_User_BookReportLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_User_BookReportLike" DROP CONSTRAINT "_User_BookReportLike_A_fkey";

-- DropForeignKey
ALTER TABLE "_User_BookReportLike" DROP CONSTRAINT "_User_BookReportLike_B_fkey";

-- DropTable
DROP TABLE "_User_BookReportLike";

-- CreateTable
CREATE TABLE "ReportLike" (
    "userId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportLike_pkey" PRIMARY KEY ("userId","reportId")
);

-- AddForeignKey
ALTER TABLE "ReportLike" ADD CONSTRAINT "ReportLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportLike" ADD CONSTRAINT "ReportLike_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
