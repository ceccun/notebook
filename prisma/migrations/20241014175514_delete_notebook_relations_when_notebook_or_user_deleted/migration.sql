-- DropForeignKey
ALTER TABLE "UserNotebook" DROP CONSTRAINT "UserNotebook_notebookId_fkey";

-- DropForeignKey
ALTER TABLE "UserNotebook" DROP CONSTRAINT "UserNotebook_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserNotebook" ADD CONSTRAINT "UserNotebook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotebook" ADD CONSTRAINT "UserNotebook_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
