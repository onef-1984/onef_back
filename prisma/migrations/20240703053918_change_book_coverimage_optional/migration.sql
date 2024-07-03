-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "coverImage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];
