/*
  Warnings:

  - You are about to drop the `Karma` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Karma";

-- CreateTable
CREATE TABLE "Kudo" (
    "userId" TEXT NOT NULL,
    "kudos" BIGINT NOT NULL,
    "kudont" BIGINT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Kudo_pkey" PRIMARY KEY ("guildId","userId")
);
