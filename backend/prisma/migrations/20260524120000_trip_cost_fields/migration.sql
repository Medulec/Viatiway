-- AlterTable
ALTER TABLE "trips" ADD COLUMN "fuel_cost" DECIMAL(10, 2),
ADD COLUMN "parking_cost" DECIMAL(10, 2),
ADD COLUMN "toll_cost" DECIMAL(10, 2),
ADD COLUMN "accommodation_cost" DECIMAL(10, 2),
ADD COLUMN "other_cost" DECIMAL(10, 2),
ADD COLUMN "other_cost_desc" TEXT,
ADD COLUMN "note" TEXT;
