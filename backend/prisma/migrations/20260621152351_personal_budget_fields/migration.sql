-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('PLN', 'EUR', 'USD');

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "budget" DECIMAL(10,2),
ADD COLUMN     "budget_food" DECIMAL(10,2),
ADD COLUMN     "budget_fun" DECIMAL(10,2),
ADD COLUMN     "budget_other" DECIMAL(10,2),
ADD COLUMN     "budget_shop" DECIMAL(10,2),
ADD COLUMN     "budget_stay" DECIMAL(10,2),
ADD COLUMN     "budget_transport" DECIMAL(10,2),
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'PLN',
ADD COLUMN     "destination_to_address" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "split_equally" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "travelers_count" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "fuel_consumption" DECIMAL(4,2),
ADD COLUMN     "name" TEXT;
