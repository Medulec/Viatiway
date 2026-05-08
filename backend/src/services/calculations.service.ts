import  prisma  from '../lib/prisma';
import { RateType, VehicleType } from '@prisma/client';

const getRateByDay = async (type: RateType, date: Date) => {
    return prisma.rate.findFirst({
        where: {type, validFrom: {lte: date}},
        orderBy: {validFrom: 'desc'}
    })
}

const calculateDietUnit = (startDate: Date, endDate: Date): number => {
    const totalHours = (endDate.getTime() - startDate.getTime()) / 3_600_000;
    if (totalHours < 0) throw new Error (`${endDate} musi być później niż ${startDate}`);

    if (totalHours < 24) {
        if (totalHours < 8) return 0;
        if (totalHours < 12) return 0.5;
    return 1;
    }
    const fullDays = Math.floor(totalHours / 24);
    const reminingHours = totalHours - fullDays * 24;
    const partialDayUnits = reminingHours <= 8 ? 0.5 : 1;
    return fullDays + partialDayUnits;
};

export const calculateTrip = async (data: {
    startDate: Date;
    endDate: Date;
    distance?: number;
    engineCapacity?: number;
    breakfastCount: number;
    lunchCount: number;
    dinnerCount: number;
    transportMode: VehicleType;
}) => {
    let kmRate: number | null = null;
    let kmTotal  = 0;

    if (data.transportMode === 'CAR_PRIVATE') {
        if(!data.distance) throw new Error('Brak dystansu dla auta prywatnego');
        if (!data.engineCapacity) throw new Error('Brak pojemności silnika dla auta prywatnego');

    const rateType: RateType = data.engineCapacity <= 900 ? 'KM_RATE_SMALL' : 'KM_RATE_LARGE';
    const rate = await getRateByDay(rateType, data.startDate);
    if (!rate) throw new Error (`Brak stawki ${rateType} dla daty ${data.startDate.toISOString()}`)
    kmRate = Number(rate.value);
    kmTotal = data.distance * kmRate;
    }

    const dietRate = await getRateByDay('DIET_RATE', data.startDate)
    if (!dietRate)  throw new Error ('Brak podanej stawki diety dla tej daty');

    const dietUnits = calculateDietUnit(data.startDate, data.endDate);
    const mealDeduciton = data.breakfastCount * 0.25 + data.lunchCount * 0.5 + data.dinnerCount * 0.25;
    const finaldietUnits = Math.max(0, dietUnits - mealDeduciton);
    const dietTotal = finaldietUnits * Number(dietRate.value)

    return {
        dietUnits,
        finaldietUnits,
        kmRate,
        kmTotal: Number(kmTotal.toFixed(2)),
        dietRate: Number(dietRate.value),
        dietTotal: Number(dietTotal.toFixed(2)),
    };
};
