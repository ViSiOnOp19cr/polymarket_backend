/*
  Warnings:

  - You are about to drop the column `Oddsno` on the `Bets` table. All the data in the column will be lost.
  - You are about to drop the column `Oddsyes` on the `Bets` table. All the data in the column will be lost.
  - Added the required column `odds` to the `Bets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bets" DROP COLUMN "Oddsno",
DROP COLUMN "Oddsyes",
ADD COLUMN     "odds" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Market" ALTER COLUMN "Oddsno" SET DEFAULT 2.0,
ALTER COLUMN "Oddsyes" SET DEFAULT 2.0;
