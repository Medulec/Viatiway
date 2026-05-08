import prisma from "../lib/prisma";
import { Vehicle } from "@prisma/client";

export const getVehicleByUserId = async (userId: string) => {
    const vehicles = await prisma.vehicle.findMany({
        where: {userId},
        orderBy: {isDefault: 'desc'}
    });
return vehicles;
}

export const getAllVehicles = async (adminId: string) => {
    const vehicles = await prisma.vehicle.findMany({
        orderBy: {id: 'desc'}
    })
return vehicles
}

export const createVehicle = async (userId: string, data: {
    vechicleType: string;
    licensePlate: string;
    isDefault: string;
})