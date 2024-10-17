-- DropForeignKey
ALTER TABLE "NotebookFile" DROP CONSTRAINT "NotebookFile_notebookFolderId_fkey";

-- DropForeignKey
ALTER TABLE "NotebookKey" DROP CONSTRAINT "NotebookKey_notebookId_fkey";

-- AddForeignKey
ALTER TABLE "NotebookKey" ADD CONSTRAINT "NotebookKey_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookFile" ADD CONSTRAINT "NotebookFile_notebookFolderId_fkey" FOREIGN KEY ("notebookFolderId") REFERENCES "NotebookFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
