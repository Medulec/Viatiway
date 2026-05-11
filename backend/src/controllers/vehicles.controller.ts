import { Request, Response } from 'express';
import {
    getVehicleByUserId as getVehicleByUserIdService,
    getAllVehicles as getAllVehiclesService,
    createVehicle as createVehicleService,
    updateVehicle as updateVehicleService,
    deleteVehicle as deleteVehicleService,
    setDefaultVehicle as setDefaultVehicleService,
} from '../services/vehicles.service';

export const getVehicleByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const vehicles = await getVehicleByUserIdService(userId);
        res.status(200).json(vehicles);
    } catch (error) {
        console.error('getVehicleByUserId error:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

export const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await getAllVehiclesService();
        res.status(200).json(vehicles);
    } catch (error) {
        console.error('getAllVehicles error:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

export const createVehicle = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const vehicle = await createVehicleService(userId, req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        console.error('createVehicle error:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

export const updateVehicle = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const vehicleId = req.params.id as string;

        const vehicle = await updateVehicleService(userId, vehicleId, req.body);

        if (!vehicle) {
            res.status(404).json({ message: 'Pojazd nie znaleziony' });
            return;
        }
        res.status(200).json(vehicle);
    } catch (error) {
        console.error('updateVehicle error:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

export const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const vehicleId = req.params.id as string;

        const result = await deleteVehicleService(userId, vehicleId);

        if (!result) {
            res.status(404).json({ message: 'Pojazd nie znaleziony' });
            return;
        }
        res.status(204).send();
    } catch (error: any) {
        if (error.message?.includes('delegacjach')) {
            res.status(409).json({ message: error.message });
            return;
        }
        console.error('deleteVehicle error:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

export const setDefaultVehicle = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const vehicleId = req.params.id as string;

        const vehicle = await setDefaultVehicleService(userId, vehicleId);

        if (!vehicle) {
            res.status(404).json({ message: 'Pojazd nie znaleziony' });
            return;
        }
        res.status(200).json(vehicle);
    } catch (error) {
        console.error('setDefaultVehicle error:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};
