import { prisma } from '../lib/prisma';

const getRateByDate = async (type: string, date: Date) => {
  const rate = await prisma.rate.findFirst({
    where: {
      type,
      validFrom: { lte: date }, 
    },
    orderBy: {
      validFrom: 'desc', 
    },
  });

  return rate;
};

const calculateDays = (startDate: Date, endDate: Date): number => {
  const diffMs = endDate.getTime() - startDate.getTime(); 
  const diffHours = diffMs / (1000 * 60 * 60); 

  return Math.ceil(diffHours / 24);
};

// ── GŁÓWNA FUNKCJA KALKULACJI ──
export const calculateTrip = async (data: {
  startDate: Date;
  endDate: Date;
  distance?: number;
  engineCapacity?: number; // pojemność silnika w cm³
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
  transportMode: string;
}) => {
  let kmRate = null;
  let kmTotal = 0;

  if (
    (data.transportMode === 'CAR_PRIVATE' || data.transportMode === 'CAR_COMPANY')
    && data.distance
    && data.engineCapacity
  ) {
    const rateType = data.engineCapacity <= 900 ? 'KM_RATE_SMALL' : 'KM_RATE_LARGE';

    kmRate = await getRateByDate(rateType, data.startDate);

    if (!kmRate) throw new Error('Brak stawki kilometrówki dla podanej daty');

    kmTotal = data.distance * kmRate.value;
  }

  const dietRate = await getRateByDate('DIET_RATE', data.startDate);
  if (!dietRate) throw new Error('Brak stawki diety dla podanej daty');

  const days = calculateDays(data.startDate, data.endDate);

  const dietTotal =
    days * dietRate.value
    - data.breakfastCount * 0.25 * dietRate.value
    - data.lunchCount    * 0.50 * dietRate.value
    - data.dinnerCount   * 0.25 * dietRate.value;

  return {
    days,
    kmRate: kmRate?.value ?? null,
    kmTotal: Number(kmTotal.toFixed(2)),
    dietRate: dietRate.value,
    dietTotal: Number(Math.max(0, dietTotal).toFixed(2)), // dieta nie może być ujemna
  };
};