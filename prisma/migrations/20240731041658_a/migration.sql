-- CreateTable
CREATE TABLE "_User_BookReportLike" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_User_BookReportLike_AB_unique" ON "_User_BookReportLike"("A", "B");

-- CreateIndex
CREATE INDEX "_User_BookReportLike_B_index" ON "_User_BookReportLike"("B");

-- AddForeignKey
ALTER TABLE "_User_BookReportLike" ADD CONSTRAINT "_User_BookReportLike_A_fkey" FOREIGN KEY ("A") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_User_BookReportLike" ADD CONSTRAINT "_User_BookReportLike_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
