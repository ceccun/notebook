-- DropForeignKey
ALTER TABLE "KeyStore" DROP CONSTRAINT "KeyStore_userId_fkey";

-- AddForeignKey
ALTER TABLE "KeyStore" ADD CONSTRAINT "KeyStore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
