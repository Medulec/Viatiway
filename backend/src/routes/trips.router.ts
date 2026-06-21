import { Router } from 'express'
import {
    getTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip,
    submitTrip,
    approveTrip
} from '../controllers/trips.controller'
import { calculateThisTrip } from '../controllers/calculations.controller'
import { adminMiddleware } from '../middleware/admin'

const router = Router();


router.get('/', getTrips);

router.get('/:id', getTripById);

router.post('/', createTrip);

router.put('/:id', updateTrip);

router.delete('/:id', deleteTrip);

router.put('/:id/submit', submitTrip);

router.put('/:id/approve', adminMiddleware, approveTrip);

router.post('/calculate', calculateThisTrip)

export default router;
