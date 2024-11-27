-- DropForeignKey
ALTER TABLE "ReportLike" DROP CONSTRAINT "ReportLike_userId_fkey";

-- AddForeignKey
ALTER TABLE "ReportLike" ADD CONSTRAINT "ReportLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
