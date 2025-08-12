-- CreateEnum
CREATE TYPE "public"."PrinterState" AS ENUM ('NOVO', 'SEMINOVO', 'RECONDICIONADO');

-- CreateEnum
CREATE TYPE "public"."PrinterDestiny" AS ENUM ('LOCACAO', 'VENDA', 'PARTICULAR');

-- CreateTable
CREATE TABLE "public"."StockPrinters" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "counterPb" INTEGER NOT NULL DEFAULT 0,
    "counterColor" INTEGER NOT NULL DEFAULT 0,
    "state" "public"."PrinterState" NOT NULL,
    "destiny" "public"."PrinterDestiny" NOT NULL,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockPrinters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockPrinters_serialNumber_key" ON "public"."StockPrinters"("serialNumber");

-- CreateIndex
CREATE INDEX "StockPrinters_modelId_idx" ON "public"."StockPrinters"("modelId");

-- AddForeignKey
ALTER TABLE "public"."StockPrinters" ADD CONSTRAINT "StockPrinters_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "public"."MasterTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
