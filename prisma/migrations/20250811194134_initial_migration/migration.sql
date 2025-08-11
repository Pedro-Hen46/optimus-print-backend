-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMINISTRADOR', 'ATENDIMENTO', 'TECNICO', 'FINANCEIRO');

-- CreateEnum
CREATE TYPE "public"."ChamadoStatus" AS ENUM ('ABERTO', 'EM_ATENDIMENTO', 'FINALIZADO', 'AGUARDANDO_PECAS', 'CANCELADO', 'REABERTO');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL DEFAULT '1839085596',
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

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
    "imageId" TEXT NOT NULL,

    CONSTRAINT "MasterTable_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "public"."UploadedFile" (
    "id" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "public"."PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "public"."PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "public"."PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "MasterTable_imageId_key" ON "public"."MasterTable"("imageId");

-- CreateIndex
CREATE INDEX "MasterTable_imageId_idx" ON "public"."MasterTable"("imageId");

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

-- CreateIndex
CREATE UNIQUE INDEX "UploadedFile_fileKey_key" ON "public"."UploadedFile"("fileKey");

-- AddForeignKey
ALTER TABLE "public"."PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MasterTable" ADD CONSTRAINT "MasterTable_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."UploadedFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contacts" ADD CONSTRAINT "Contacts_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Addresses" ADD CONSTRAINT "Addresses_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
