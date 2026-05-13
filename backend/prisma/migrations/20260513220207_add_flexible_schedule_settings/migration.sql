/*
  Warnings:

  - You are about to drop the column `break_between_matches` on the `tournament_settings` table. All the data in the column will be lost.
  - You are about to drop the column `time_slots` on the `tournament_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tournament_settings" DROP COLUMN "break_between_matches",
DROP COLUMN "time_slots",
ADD COLUMN     "day_end_time" TEXT NOT NULL DEFAULT '22:00',
ADD COLUMN     "day_start_time" TEXT NOT NULL DEFAULT '10:00';
