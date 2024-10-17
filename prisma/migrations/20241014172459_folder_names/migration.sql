/*
  Warnings:

  - Added the required column `name` to the `NotebookFolder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NotebookFolder" DROP CONSTRAINT "NotebookFolder_notebookId_fkey";

-- DropForeignKey
ALTER TABLE "NotebookFolder" DROP CONSTRAINT "NotebookFolder_parentId_fkey";

-- AlterTable
ALTER TABLE "NotebookFolder" ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "NotebookFolder" ADD CONSTRAINT "NotebookFolder_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookFolder" ADD CONSTRAINT "NotebookFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NotebookFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
