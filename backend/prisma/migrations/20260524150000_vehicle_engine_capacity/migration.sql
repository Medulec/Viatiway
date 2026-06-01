-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN "engine_capacity" INTEGER;

-- Backfill: domyślnie 1500 ccm dla istniejących CAR_PRIVATE (zakres >900cc → stawka KM_RATE_LARGE)
UPDATE "vehicles" SET "engine_capacity" = 1500 WHERE "vehicle_type" = 'CAR_PRIVATE' AND "engine_capacity" IS NULL;
