import { Router } from 'express'
import { loginHandler, refreshHandler, logoutHandler, meHandler, updateMeHandler } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/login',   loginHandler)
router.post('/refresh', refreshHandler)
router.post('/logout',  logoutHandler)
router.get('/me',       authMiddleware, meHandler)
router.put('/me',       authMiddleware, updateMeHandler)

export default router
