
import prisma from '../lib/prisma';
import { VehicleType } from '@prisma/client';

export const getTripsByUserId = async (userId: string) => {
    const trips = await prisma.trip.findMany({
        where: {userId},
        orderBy: {createdAt: 'desc'}
    });
return trips
};

export const getTripByIdAndUserId = async (tripId: string, userId: string) => {
    const trip = await prisma.trip.findFirst({
        where: {id: tripId, userId: userId}
    });
return trip
};

export const createTrip = async (userId: string, data: {
destinationFrom: string;
destinationTo: string;
startDate: string;
endDate: string;
purpose: string;
client: string;
transportMode: string;
distance?: number;
vechicleId?: number;
ticketCost?: number;
breakfastCount?: number;
lunchCount?: number;
dinnerCount?: number;
}) => {
    const trip = await prisma.trip.create({
        data: {
            userId,
            destinationFrom: data.destinationFrom,
            destinationTo: data.destinationTo,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            purpose: data.purpose,
            client: data.client,
            transportMode: data.transportMode as VehicleType,
            distance: data.distance,
            vechicleId: data.vechicleId,
            ticketCost: data.ticketCost,
            breakfastCount: data.breakfastCount ?? 0,
            lunchCount: data.lunchCount ?? 0,
            dinnerCount: data.dinnerCount ?? 0,
        }
    });
return trip
};

export const updateTrip = async (tripId: string, userId: string, data: Partial<{
  destinationFrom: string;
  destinationTo: string;
  startDate: string;
  endDate: string;
  purpose: string;
  client: string;
  transportMode: string;
  distance: number;
  vehicleId: string;
  ticketCost: number;
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
}>) => {
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

  const updated = await prisma.trip.update({
    where: {id: tripId},
    data: {status: "APPROVED"},
  })
  return updated;
}