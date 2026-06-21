
import prisma from '../lib/prisma';
import { VehicleType, Currency } from '@prisma/client';
import { createTripHistorySnapshot } from './tripsHistory.service';

const toNum = (v: unknown) => (v != null ? Number(v) : null);

type TripInput = {
    name?: string;
    destinationFrom?: string;
    destinationTo?: string;
    destinationToAddress?: string;
    startDate?: string;
    endDate?: string;
    purpose?: string;
    client?: string;
    transportMode?: string;
    distance?: number;
    vehicleId?: string;
    ticketCost?: number;
    breakfastCount?: number;
    lunchCount?: number;
    dinnerCount?: number;
    note?: string;
    budget?: number;
    currency?: string;
    travelersCount?: number;
    splitEqually?: boolean;
    budgetTransport?: number;
    budgetStay?: number;
    budgetFood?: number;
    budgetFun?: number;
    budgetShop?: number;
    budgetOther?: number;
};

export const getTripsByUserId = async (userId: string) => {
    const trips = await prisma.trip.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            history: { orderBy: { settledAt: 'desc' }, take: 1 },
        },
    });
    return trips.map(({
        history, distance, ticketCost,
        budget, budgetTransport, budgetStay, budgetFood, budgetFun, budgetShop, budgetOther,
        ...rest
    }) => ({
        ...rest,
        distance: toNum(distance),
        ticketCost: toNum(ticketCost),
        budget: toNum(budget),
        budgetTransport: toNum(budgetTransport),
        budgetStay: toNum(budgetStay),
        budgetFood: toNum(budgetFood),
        budgetFun: toNum(budgetFun),
        budgetShop: toNum(budgetShop),
        budgetOther: toNum(budgetOther),
        totalAmount: history[0] ? Number(history[0].totalAmount) : null,
    }));
};

export const getTripByIdAndUserId = async (tripId: string, userId: string) => {
    const trip = await prisma.trip.findFirst({
        where: { id: tripId, userId },
        include: { history: { orderBy: { settledAt: 'desc' }, take: 1 } }
    });
    if (!trip) return null;

    const {
        history, distance, ticketCost,
        budget, budgetTransport, budgetStay, budgetFood, budgetFun, budgetShop, budgetOther,
        ...rest
    } = trip;
    return {
        ...rest,
        distance: toNum(distance),
        ticketCost: toNum(ticketCost),
        budget: toNum(budget),
        budgetTransport: toNum(budgetTransport),
        budgetStay: toNum(budgetStay),
        budgetFood: toNum(budgetFood),
        budgetFun: toNum(budgetFun),
        budgetShop: toNum(budgetShop),
        budgetOther: toNum(budgetOther),
        totalAmount: history[0] ? Number(history[0].totalAmount) : null,
    };
};

export const createTrip = async (userId: string, data: TripInput) => {
    const trip = await prisma.trip.create({
        data: {
            userId,
            transportMode: (data.transportMode ?? 'CAR_PRIVATE') as VehicleType,
            name: data.name,
            destinationFrom: data.destinationFrom,
            destinationTo: data.destinationTo,
            destinationToAddress: data.destinationToAddress,
            ...(data.startDate && { startDate: new Date(data.startDate) }),
            ...(data.endDate && { endDate: new Date(data.endDate) }),
            purpose: data.purpose,
            client: data.client,
            distance: data.distance,
            vehicleId: data.vehicleId,
            ticketCost: data.ticketCost,
            breakfastCount: data.breakfastCount ?? 0,
            lunchCount: data.lunchCount ?? 0,
            dinnerCount: data.dinnerCount ?? 0,
            note: data.note,
            budget: data.budget,
            ...(data.currency && { currency: data.currency as Currency }),
            travelersCount: data.travelersCount ?? 1,
            splitEqually: data.splitEqually ?? false,
            budgetTransport: data.budgetTransport,
            budgetStay: data.budgetStay,
            budgetFood: data.budgetFood,
            budgetFun: data.budgetFun,
            budgetShop: data.budgetShop,
            budgetOther: data.budgetOther,
        }
    });
return trip
};

export const updateTrip = async (tripId: string, userId: string, data: TripInput) => {
  const existing = await prisma.trip.findFirst({
    where: { id: tripId, userId },
  });
  if (!existing) return null;

  if (existing.status !== 'DRAFT') {
    throw new Error('Można edytować tylko szkice delegacji!');
  }

  const updated = await prisma.trip.update({
    where: { id: tripId },
    data: {
      ...Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      ),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.transportMode && { transportMode: data.transportMode as VehicleType }),
    },
  });

  return updated;
};

export const deleteTrip = async (tripId: string, userId: string) => {
  const existing = await prisma.trip.findFirst({
    where: {id: tripId, userId},
  });
  if (!existing) return null;

  if (existing.status !== "DRAFT") {
    throw new Error ("Można usuwać tylko szkice delegacji!")
  }

  await prisma.trip.delete({
    where: { id: tripId }
  })
  return true;
};

export const submitTrip = async (tripId: string, userId: string) => {
  const existing = await prisma.trip.findFirst({
    where: {id: tripId, userId}
  });

  if (!existing) return null;
  if (existing.status !== "DRAFT") {
    throw new Error("Tylko szkice delegacji można wysłać do rozliczenia!")
  }

  const updated = await prisma.trip.update({
    where: { id: tripId },
    data: { status: "SUBMITTED"},
  });

  return updated;
}

export const approveTrip = async (tripId: string, adminId: string) => {
  const existing = await prisma.trip.findFirst({
  where: {id: tripId},
  });
  if (!existing) return null;

  if (existing.status !== "SUBMITTED") {
    throw new Error('Tylko przesłane delegacje są możliwe do zatwierdzenia!');
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.trip.update({
      where: { id: tripId },
      data: { status: "APPROVED" },
    });
    await createTripHistorySnapshot(tripId, adminId, tx);
    return updated;
  });
}