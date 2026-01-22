/*
  Warnings:

  - You are about to alter the column `email` on the `invites` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `createdById` on the `projects` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `description` on the `projects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - Added the required column `createdBy` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_createdById_fkey";

-- AlterTable
ALTER TABLE "invites" ALTER COLUMN "email" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "createdById",
ADD COLUMN     "createdBy" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(100);

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
