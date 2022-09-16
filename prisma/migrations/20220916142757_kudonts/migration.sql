/*
  Warnings:

  - The primary key for the `Kudo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `kudont` on the `Kudo` table. All the data in the column will be lost.
  - The required column `id` was added to the `Kudo` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `kudonts` to the `Kudo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kudo" DROP CONSTRAINT "Kudo_pkey",
DROP COLUMN "kudont",
ADD COLUMN     "givenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "kudonts" BIGINT NOT NULL,
ADD CONSTRAINT "Kudo_pkey" PRIMARY KEY ("id");
