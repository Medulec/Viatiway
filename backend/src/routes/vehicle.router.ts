import { Router } from "express";
import {
    getVehicleByUserId,
    getAllVehicles,
    createVehicle,
    setDefaultVehicle,
    updateVehicle,
    deleteVehicle
} from '../controllers/vehicles.controller';
import { adminMiddleware } from "../middleware/admin";

const router = Router();

router.get('/', getVehicleByUserId);

router.post('/', createVehicle);

router.put('/:id', updateVehicle);

router.delete('/:id', deleteVehicle);

router.patch('/:id/default', setDefaultVehicle);

router.get('/all', adminMiddleware, getAllVehicles);

export default router;
