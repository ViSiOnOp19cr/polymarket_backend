/*
  Warnings:

  - You are about to drop the column `Odds` on the `Bets` table. All the data in the column will be lost.
  - Added the required column `Oddsno` to the `Bets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Oddsyes` to the `Bets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bets" DROP COLUMN "Odds",
ADD COLUMN     "Oddsno" INTEGER NOT NULL,
ADD COLUMN     "Oddsyes" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Market" ADD COLUMN     "Oddsno" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "Oddsyes" DOUBLE PRECISION DEFAULT 0;
