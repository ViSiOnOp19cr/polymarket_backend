/*
  Warnings:

  - Added the required column `Odds` to the `Bets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bets" ADD COLUMN     "Odds" INTEGER NOT NULL;
