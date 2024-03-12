/*
  Warnings:

  - You are about to drop the column `isPublished` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "userRole" DROP CONSTRAINT "userRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "userRole" DROP CONSTRAINT "userRole_userId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "isPublished";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "userRole";

-- DropEnum
DROP TYPE "RoleEnum";
