import 'dotenv/config'
import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import { authMiddleware } from './middleware/auth'
import { adminMiddleware } from './middleware/admin'
import authRouter from './routes/auth.router'
import tripsRouter from './routes/trips.router'
import vehicleRouter from './routes/vehicle.router'

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// PUBLIC
app.use('/api/v1/auth', authRouter)

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
})

// PROTECTED
app.use('/api/v1/trips',    authMiddleware, tripsRouter)
app.use('/api/v1/vehicles', authMiddleware, vehicleRouter)
app.use('/api/v1/admin',    authMiddleware, adminMiddleware)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
