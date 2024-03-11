-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isVerified" SET DEFAULT false,
ALTER COLUMN "passwordResetToken" DROP NOT NULL;
