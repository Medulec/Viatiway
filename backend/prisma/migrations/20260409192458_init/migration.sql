-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'TEXT', 'RECORDING');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR_COMPANY', 'CAR_PRIVATE', 'TRAIN', 'PLANE', 'BUS');

-- CreateEnum
CREATE TYPE "RateType" AS ENUM ('KM_RATE_SMALL', 'KM_RATE_LARGE', 'DIET_RATE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT,
    "role" TEXT,
    "access_level" "Permission" NOT NULL,
    "phone" TEXT,
    "home_address" TEXT,
    "mpk" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "transport_mode" "VehicleType" NOT NULL,
    "vehicle_id" UUID,
    "ticket_cost" DECIMAL(10,2),
    "destination_from" TEXT,
    "destination_to" TEXT,
    "distance" DECIMAL(10,2),
    "purpose" TEXT,
    "client" TEXT,
    "breakfast_count" INTEGER NOT NULL DEFAULT 0,
    "lunch_count" INTEGER NOT NULL DEFAULT 0,
    "dinner_count" INTEGER NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TripStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips_history" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "km_rate" DECIMAL(10,4) NOT NULL,
    "diet_rate" DECIMAL(10,2) NOT NULL,
    "km_total" DECIMAL(10,2) NOT NULL,
    "diet_total" DECIMAL(10,2) NOT NULL,
    "fuel_cost" DECIMAL(10,2) DEFAULT 0,
    "accommodation_cost" DECIMAL(10,2) DEFAULT 0,
    "parking_cost" DECIMAL(10,2) DEFAULT 0,
    "toll_cost" DECIMAL(10,2) DEFAULT 0,
    "other_cost" DECIMAL(10,2) DEFAULT 0,
    "other_cost_desc" TEXT,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "settled_by" UUID,
    "settled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "trips_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "type" "FileType" NOT NULL,
    "content" TEXT,
    "file_path" TEXT,
    "file_name" TEXT,
    "mime_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rates" (
    "id" UUID NOT NULL,
    "type" "RateType" NOT NULL,
    "value" DECIMAL(10,4) NOT NULL,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" UUID,

    CONSTRAINT "rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "vehicle_type" "VehicleType" NOT NULL,
    "license_plate" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips_history" ADD CONSTRAINT "trips_history_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips_history" ADD CONSTRAINT "trips_history_settled_by_fkey" FOREIGN KEY ("settled_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rates" ADD CONSTRAINT "rates_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
