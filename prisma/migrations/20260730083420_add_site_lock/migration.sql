-- CreateTable
CREATE TABLE "SiteLock" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteLock_pkey" PRIMARY KEY ("id")
);
