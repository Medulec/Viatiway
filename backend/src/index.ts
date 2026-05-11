import 'dotenv/config'
import express, { Request, Response } from 'express'
import { authMiddleware } from './middleware/auth'
import { adminMiddleware } from './middleware/admin'
import tripsRouter from './routes/trips.router';
import vehicleRouter from './routes/vehicle.router';
import Routing from './routes/auth'

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

app.use('/api/v1/auth', Routing) // PUBLIC

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
})

///////////
app.use(authMiddleware) // SECURE V

app.use('/api/v1/admin', authMiddleware, adminMiddleware, /*adminRouter*/)

app.use('/api/v1/trips', authMiddleware, tripsRouter);

app.use('/api/v1/vehicles', authMiddleware, vehicleRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

///////