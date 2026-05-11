import { VerifyCallback } from "jsonwebtoken";
import prisma from "../lib/prisma";
import { VehicleType } from "@prisma/client";
import { Vehicle } from "@prisma/client";

export const getVehicleByUserId = async (userId: string) => {
    const vehicles = await prisma.vehicle.findMany({
        where: {userId},
        orderBy: {isDefault: 'desc'}
    });
return vehicles;
}

export const getAllVehicles = async () => {
    const vehicles = await prisma.vehicle.findMany({
        orderBy: {id: 'desc'}
    })
return vehicles
}

export const createVehicle = async (userId: string, data: {
    vehicleType: VehicleType;
    licensePlate: string;
    isDefault?: boolean;
}) => {
    const existingCount = await prisma.vehicle.count({
        where: {userId}
    })
    const shouldDef = existingCount === 0 || data.isDefault;

    const vehicle = await prisma.$transaction(async (tx) => {
        if (shouldDef) {
            await tx.vehicle.updateMany({
                where: { userId, isDefault: true},
                data: {isDefault: false}
            });
        }
        return tx.vehicle.create({
            data: {
                userId,
                licensePlate: data.licensePlate,
                vehicleType: data.vehicleType,
                isDefault: shouldDef
            }
        })
    })
    return vehicle;
}

export const setDefaultVehicle = async (userId: string, vehicleId: string) => {
    const existing = await prisma.vehicle.findFirst({
        where: {id: vehicleId, userId}
    });
    if (!existing) return null;

    if(existing.isDefault) return existing;

    const setDefault = await prisma.$transaction(async (tx) => {
        await tx.vehicle.updateMany({
            where: {userId, isDefault: true},
            data: {isDefault: false}
        })
        return tx.vehicle.update({
            where: {id: vehicleId},
            data: {isDefault: true}
        })
    })
    return setDefault
}

export const updateVehicle = async (userId: string, vehicleId: string, data: Partial<{
    vehicleType: VehicleType,
    licensePlate: string
}>) => {
    const existing = await prisma.vehicle.findFirst({
        where: {id: vehicleId, userId}
    })
    if (!existing) return null;

    const update = await prisma.vehicle.update({
        where: {id: vehicleId },
        data: {
        ...(data.licensePlate && { licensePlate: data.licensePlate }),
        ...(data.vehicleType && { vehicleType: data.vehicleType })
        }
    })
    return update
}

export const deleteVehicle = async (userId: string, vehicleId: string) => {
    const existing = await prisma.vehicle.findFirst({
        where: {id: vehicleId, userId}
    })
    if (!existing) return null;

    const tripsCount = await prisma.trip.count({
        where: {vehicleId}
    });
    if (tripsCount > 0) {
        throw new Error("Nie można usunąć pojazdu używanego w delegacjach")
    }

    if (!existing.isDefault) {
        return prisma.vehicle.delete({
            where: {id: vehicleId}
        });
    }

    return prisma.$transaction(async (tx) => {
        const deleted = await tx.vehicle.delete({
            where: {id: vehicleId}
        });

        const next = await tx.vehicle.findFirst({
            where: {userId},
            orderBy: {id: 'asc'}
        });
        if (next) {
            await tx.vehicle.update({
                where: {id: next.id},
                data: {isDefault: true}
            });
        }
        return deleted;
    });
}
