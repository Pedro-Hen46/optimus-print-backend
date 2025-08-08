/*
  Warnings:

  - You are about to drop the `Clientes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contato` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Endereco` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Contato" DROP CONSTRAINT "Contato_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Endereco" DROP CONSTRAINT "Endereco_clienteId_fkey";

-- DropTable
DROP TABLE "public"."Clientes";

-- DropTable
DROP TABLE "public"."Contato";

-- DropTable
DROP TABLE "public"."Endereco";

-- CreateTable
CREATE TABLE "public"."Customers" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "ie" TEXT,
    "telefone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contacts" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Addresses" (
    "id" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "clienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customers_email_key" ON "public"."Customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_cnpj_key" ON "public"."Customers"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_email_key" ON "public"."Contacts"("email");

-- CreateIndex
CREATE INDEX "Contacts_clienteId_idx" ON "public"."Contacts"("clienteId");

-- CreateIndex
CREATE INDEX "Addresses_clienteId_idx" ON "public"."Addresses"("clienteId");

-- AddForeignKey
ALTER TABLE "public"."Contacts" ADD CONSTRAINT "Contacts_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Addresses" ADD CONSTRAINT "Addresses_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
