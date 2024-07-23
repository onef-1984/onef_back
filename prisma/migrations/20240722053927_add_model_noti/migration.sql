-- AlterTable
ALTER TABLE "SubInfo" ALTER COLUMN "subTitle" DROP NOT NULL,
ALTER COLUMN "originalTitle" DROP NOT NULL,
ALTER COLUMN "itemPage" DROP NOT NULL,
ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "sizeDepth" DROP NOT NULL,
ALTER COLUMN "sizeHeight" DROP NOT NULL,
ALTER COLUMN "sizeWidth" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Noti" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Noti_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Noti_userId_key" ON "Noti"("userId");

-- AddForeignKey
ALTER TABLE "Noti" ADD CONSTRAINT "Noti_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
