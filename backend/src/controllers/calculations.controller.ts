import { Request, Response } from 'express';
import { calculateTrip } from '../services/calculations.service';

export const calculateThisTrip = async (req: Request, res: Response) => {
    try {
        const {
            startDate,
            endDate,
            distance,
            engineCapacity,
            breakfastCount = 0,
            dinnerCount = 0,
            lunchCount = 0,
            transportMode,
        } = req.body;
    const result = await calculateTrip({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        distance,
        engineCapacity,
        breakfastCount,
        dinnerCount,
        lunchCount,
        transportMode,
    });
    res.status(200).json(result);
    } catch (error: any) {
        console.error('calculationTrup error: ', error);
    res.status(400).json({message: error.message})
    }
};