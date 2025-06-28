/*
  Warnings:

  - Added the required column `catagory` to the `Market` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MarketCatagory" AS ENUM ('Sports', 'Esports');

-- AlterTable
ALTER TABLE "Market" ADD COLUMN     "catagory" "MarketCatagory" NOT NULL;
