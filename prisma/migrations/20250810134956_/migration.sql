-- CreateTable
CREATE TABLE "public"."MasterTable" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "observation" TEXT,
    "value" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterTable_pkey" PRIMARY KEY ("id")
);
