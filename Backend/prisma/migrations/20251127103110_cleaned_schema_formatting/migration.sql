/*
  Warnings:

  - You are about to drop the column `orderIndex` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `TestCase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `TestCase` DROP COLUMN `orderIndex`,
    DROP COLUMN `points`;
