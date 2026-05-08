import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { calculateTrip } from './calculations.service';

export const createTripHistorySnapshot = async (
    tripId: string,
    adminId: string,
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? prisma;

    const trip = await client.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new Error('Delegacja nie istnieje');
    if (!trip.startDate || !trip.endDate) {
        throw new Error('Delegacja nie ma ustawionych dat');
    }

    const calc = await calculateTrip({
        startDate: trip.startDate,
        endDate: trip.endDate,
        distance: trip.distance ? Number(trip.distance) : undefined,
        breakfastCount: trip.breakfastCount,
        lunchCount: trip.lunchCount,
        dinnerCount: trip.dinnerCount,
        transportMode: trip.transportMode,
    });

    const ticketCost = trip.ticketCost ? Number(trip.ticketCost) : 0;
    const totalAmount = Number(
        (calc.kmTotal + calc.dietTotal + ticketCost).toFixed(2)
    );

    return client.tripHistory.create({
        data: {
            tripId: trip.id,
            kmRate: calc.kmRate ?? 0,
            dietRate: calc.dietRate,
            kmTotal: calc.kmTotal,
            dietTotal: calc.dietTotal,
            totalAmount,
            settledBy: adminId,
        },
    });
};
