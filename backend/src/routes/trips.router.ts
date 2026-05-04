import { Router } from 'express'
import {
    getTrips,
} from '../controllers/trips.controller'

const router = Router();

router.get('/', getTrips);

export default router;
