import { Request, Response } from 'express';
import { getTripsByUserId } from '../services/trips.service';

export const getTrips = async (req: Request, res: Response) => {
  try {
    // req.user jest dostępne bo authMiddleware zweryfikował token
    // i zapisał dane usera do req.user (patrz express.d.ts)
    const userId = req.user!.id;

    const trips = await getTripsByUserId(userId);

    res.status(200).json(trips);
  } catch (error) {
    console.error('getTrips error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};