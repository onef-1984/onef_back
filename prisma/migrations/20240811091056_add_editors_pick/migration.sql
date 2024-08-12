-- CreateTable
CREATE TABLE "EditorsPick" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportId" TEXT,

    CONSTRAINT "EditorsPick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EditorsPick_reportId_key" ON "EditorsPick"("reportId");

-- AddForeignKey
ALTER TABLE "EditorsPick" ADD CONSTRAINT "EditorsPick_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;
