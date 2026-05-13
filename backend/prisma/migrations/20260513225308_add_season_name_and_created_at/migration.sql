-- AlterTable
CREATE SEQUENCE seasons_season_id_seq;
ALTER TABLE "seasons" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Новый сезон',
ALTER COLUMN "season_id" SET DEFAULT nextval('seasons_season_id_seq');
ALTER SEQUENCE seasons_season_id_seq OWNED BY "seasons"."season_id";
