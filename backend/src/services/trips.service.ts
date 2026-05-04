
import prisma from '../lib/prisma';

export const getTripsByUserId = async (userId: string) => {
    const trips = await prisma.trip.findMany({
        where: {userId},
        orderBy: {createdAt: 'desc'}
    });

return trips
};