import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../lib/tokens'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.access_token

  if (!token) {
    res.status(401).json({ message: 'Brak tokenu' })
    return
  }

  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    res.status(401).json({ message: 'Token nieprawidłowy lub wygasł' })
  }
}
