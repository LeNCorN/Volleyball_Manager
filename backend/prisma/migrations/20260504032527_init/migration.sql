-- CreateEnum
CREATE TYPE "DivisionEnum" AS ENUM ('hard', 'medium', 'light');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "PositionEnum" AS ENUM ('attacker', 'setter', 'libero', 'blocker');

-- CreateEnum
CREATE TYPE "SkillLevelEnum" AS ENUM ('light', 'light_plus', 'light_plus_plus', 'medium', 'medium_plus', 'hard', 'hard_plus');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('scheduled', 'in_progress', 'finished', 'forfeit');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('regulations', 'volleyball_rules', 'referee_rules', 'other');

-- CreateTable
CREATE TABLE "divisions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "description" TEXT,

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "season_id" INTEGER NOT NULL DEFAULT 1,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "weeks_count" INTEGER NOT NULL DEFAULT 10,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "schedule_generated" BOOLEAN NOT NULL DEFAULT false,
    "groups_configured" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("season_id")
);

-- CreateTable
CREATE TABLE "team_applications" (
    "id" TEXT NOT NULL,
    "team_name" VARCHAR(100) NOT NULL,
    "division" "DivisionEnum" NOT NULL,
    "captain_name" VARCHAR(100) NOT NULL,
    "captain_phone" VARCHAR(20) NOT NULL,
    "captain_email" VARCHAR(100) NOT NULL,
    "emblem_url" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" TEXT,

    CONSTRAINT "team_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "division_id" INTEGER NOT NULL,
    "group_letter" CHAR(1),
    "captain_name" VARCHAR(100) NOT NULL,
    "emblem_url" TEXT,
    "is_waiting" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "application_id" TEXT,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "height_cm" INTEGER NOT NULL,
    "position" "PositionEnum" NOT NULL,
    "skill_level" "SkillLevelEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_applications" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "height_cm" INTEGER NOT NULL,
    "position" "PositionEnum" NOT NULL,
    "skill_level" "SkillLevelEnum" NOT NULL,

    CONSTRAINT "player_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "division_id" INTEGER NOT NULL,
    "group_letter" CHAR(1),
    "home_team_id" TEXT NOT NULL,
    "away_team_id" TEXT NOT NULL,
    "match_date" TIMESTAMP(3) NOT NULL,
    "match_time" TEXT NOT NULL,
    "court_number" INTEGER NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'scheduled',
    "referee_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_sets" (
    "match_id" TEXT NOT NULL,
    "set_number" INTEGER NOT NULL,
    "home_points" INTEGER NOT NULL,
    "away_points" INTEGER NOT NULL,

    CONSTRAINT "match_sets_pkey" PRIMARY KEY ("match_id","set_number")
);

-- CreateTable
CREATE TABLE "match_protocols" (
    "match_id" TEXT NOT NULL,
    "home_sets_won" INTEGER NOT NULL DEFAULT 0,
    "away_sets_won" INTEGER NOT NULL DEFAULT 0,
    "home_total_points" INTEGER NOT NULL DEFAULT 0,
    "away_total_points" INTEGER NOT NULL DEFAULT 0,
    "is_validated" BOOLEAN NOT NULL DEFAULT false,
    "validated_at" TIMESTAMP(3),
    "validated_by" TEXT,

    CONSTRAINT "match_protocols_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "mvp_votes" (
    "match_id" TEXT NOT NULL,
    "voter_team_id" TEXT NOT NULL,
    "mvp_player_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "mvp_votes_pkey" PRIMARY KEY ("match_id","voter_team_id")
);

-- CreateTable
CREATE TABLE "referees" (
    "id" TEXT NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referee_ratings" (
    "match_id" TEXT NOT NULL,
    "rating_team_id" TEXT NOT NULL,
    "referee_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "referee_ratings_pkey" PRIMARY KEY ("match_id","rating_team_id")
);

-- CreateTable
CREATE TABLE "referee_ratings_aggregated" (
    "referee_id" TEXT NOT NULL,
    "matches_count" INTEGER NOT NULL DEFAULT 0,
    "score5_count" INTEGER NOT NULL DEFAULT 0,
    "score4_count" INTEGER NOT NULL DEFAULT 0,
    "score3_count" INTEGER NOT NULL DEFAULT 0,
    "score2_count" INTEGER NOT NULL DEFAULT 0,
    "average_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unique_teams_count" INTEGER NOT NULL DEFAULT 0,
    "final_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referee_ratings_aggregated_pkey" PRIMARY KEY ("referee_id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "category" "DocumentCategory" NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "uploaded_by" TEXT NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "divisions_name_key" ON "divisions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "teams_application_id_key" ON "teams"("application_id");

-- CreateIndex
CREATE INDEX "teams_division_id_group_letter_idx" ON "teams"("division_id", "group_letter");

-- CreateIndex
CREATE INDEX "teams_is_waiting_idx" ON "teams"("is_waiting");

-- CreateIndex
CREATE INDEX "players_team_id_idx" ON "players"("team_id");

-- CreateIndex
CREATE INDEX "matches_match_date_idx" ON "matches"("match_date");

-- CreateIndex
CREATE INDEX "matches_division_id_group_letter_idx" ON "matches"("division_id", "group_letter");

-- CreateIndex
CREATE INDEX "matches_status_idx" ON "matches"("status");

-- CreateIndex
CREATE UNIQUE INDEX "matches_match_date_match_time_court_number_key" ON "matches"("match_date", "match_time", "court_number");

-- CreateIndex
CREATE INDEX "mvp_votes_mvp_player_id_idx" ON "mvp_votes"("mvp_player_id");

-- CreateIndex
CREATE INDEX "referee_ratings_referee_id_idx" ON "referee_ratings"("referee_id");

-- CreateIndex
CREATE INDEX "documents_category_is_published_idx" ON "documents"("category", "is_published");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- AddForeignKey
ALTER TABLE "team_applications" ADD CONSTRAINT "team_applications_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "team_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_applications" ADD CONSTRAINT "player_applications_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "team_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "referees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_sets" ADD CONSTRAINT "match_sets_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_protocols" ADD CONSTRAINT "match_protocols_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_protocols" ADD CONSTRAINT "match_protocols_validated_by_fkey" FOREIGN KEY ("validated_by") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mvp_votes" ADD CONSTRAINT "mvp_votes_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mvp_votes" ADD CONSTRAINT "mvp_votes_voter_team_id_fkey" FOREIGN KEY ("voter_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mvp_votes" ADD CONSTRAINT "mvp_votes_mvp_player_id_fkey" FOREIGN KEY ("mvp_player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mvp_votes" ADD CONSTRAINT "mvp_votes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_ratings" ADD CONSTRAINT "referee_ratings_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_ratings" ADD CONSTRAINT "referee_ratings_rating_team_id_fkey" FOREIGN KEY ("rating_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_ratings" ADD CONSTRAINT "referee_ratings_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "referees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_ratings" ADD CONSTRAINT "referee_ratings_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_ratings_aggregated" ADD CONSTRAINT "referee_ratings_aggregated_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "referees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
