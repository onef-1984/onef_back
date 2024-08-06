-- DropForeignKey
ALTER TABLE "ReportLike" DROP CONSTRAINT "ReportLike_reportId_fkey";

-- AddForeignKey
ALTER TABLE "ReportLike" ADD CONSTRAINT "ReportLike_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
