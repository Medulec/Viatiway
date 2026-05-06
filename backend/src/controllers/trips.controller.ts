import { Request, Response } from 'express';
import { getTripsByUserId, 
  createTrip as createTripService,
  updateTrip as updateTripService,
  deleteTrip as deleteTripService,
  submitTrip as submitTripService,
  approveTrip as approveTripService
 } from '../services/trips.service';

export const getTrips = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const trips = await getTripsByUserId(userId);

    res.status(200).json(trips);
  } catch (error) {
    console.error('getTrips error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const createTrip = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const trip = await createTripService(userId, req.body);

    res.status(201).json(trip);
  } catch (error) {
    console.error('createTrip error:', error);
    res.status(500).json({ message: 'Błąd serwera' }); 
  }
};

export const updateTrip = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const tripId = req.params.id as string;

    const trip = await updateTripService(tripId, userId, req.body);

    if (!trip) {
      res.status(404).json({ message: 'Delegacja nie znaleziona' });
      return;
    }

    res.status(200).json(trip);
  } catch (error: any) {
    if (error.message.includes('DRAFT')) {
      res.status(403).json({ message: error.message });
      return;
    }

    console.error('updateTrip error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const tripId = req.params.id as string;

    const result = await deleteTripService(tripId, userId);

    if (!result) {
      res.status(404).json({message: "Delegancja nieodnaleziona"});
      return;
    }
  res.status(204).send();
  } catch (error: any) {
    if (error.message.includes('DRAFT')) {
      res.status(403).json({message: error.message})
      return;
    }
    console.error('deleteTrip erorr: ', error)
    res.status(500).json({message: "Błąd serwera"});
  }
};

export const submitTrip = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const tripId = req.params.id as string;

    const trip = await submitTripService(tripId, userId)

    if (!trip) {
      res.status(404).json({message: "Delegacja nieodnaleziona"})
      return;
    }
    res.status(200).json(trip);
  } catch (error: any) {
    if (error.message.includes('DRAFT')) {
      res.status(403).json({message: error.message})
      return
    }
    console.error('submitTrip error:', error);
    res.status(500).json({ message: 'Błąd serwera'})
  }
}

export const approveTrip = async (req: Request, res: Response) => {
  try {
    const adminId = req.user!.id;
    const tripId = req.params.id as string;
    const trip = await approveTripService(tripId, adminId) 
    if (!trip) {
      res.status(404).json({message: "Delegacja nieodnaleziona"})
      return;
    }

    res.status(200).json(trip); 
  } catch (error: any) {
    if (error.message.includes('SUBMITTED')) {
      res.status(403).json({ message: error.message });
      return;
    }
    console.error('approveTrip error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
}

