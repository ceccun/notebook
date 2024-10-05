/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserNotebookRelationship" AS ENUM ('OWNER', 'COLLABORATOR', 'VIEWER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "KeyStore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "KeyStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotebook" (
    "id" TEXT NOT NULL,
    "relationship" "UserNotebookRelationship" NOT NULL DEFAULT 'VIEWER',
    "userId" TEXT,
    "notebookId" TEXT,

    CONSTRAINT "UserNotebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notebook" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isEncrypted" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Notebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotebookKey" (
    "id" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "notebookId" TEXT,
    "challenge" TEXT NOT NULL,
    "challengePlainText" TEXT NOT NULL,

    CONSTRAINT "NotebookKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotebookFolder" (
    "id" TEXT NOT NULL,
    "notebookId" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotebookFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotebookFile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notebookFolderId" TEXT NOT NULL,

    CONSTRAINT "NotebookFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "KeyStore" ADD CONSTRAINT "KeyStore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotebook" ADD CONSTRAINT "UserNotebook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotebook" ADD CONSTRAINT "UserNotebook_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookKey" ADD CONSTRAINT "NotebookKey_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookFolder" ADD CONSTRAINT "NotebookFolder_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookFolder" ADD CONSTRAINT "NotebookFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NotebookFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookFile" ADD CONSTRAINT "NotebookFile_notebookFolderId_fkey" FOREIGN KEY ("notebookFolderId") REFERENCES "NotebookFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
