import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { subscribeHandler } from '../controllers/newsletter.controller'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { message: 'Zbyt wiele prób. Spróbuj za 15 minut.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const router = Router()

router.post('/', limiter, subscribeHandler)

export default router
