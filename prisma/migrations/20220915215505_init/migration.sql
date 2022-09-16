-- CreateTable
CREATE TABLE "Karma" (
    "userId" TEXT NOT NULL,
    "kudos" INTEGER NOT NULL,
    "kudont" INTEGER NOT NULL,

    CONSTRAINT "Karma_pkey" PRIMARY KEY ("userId")
);
