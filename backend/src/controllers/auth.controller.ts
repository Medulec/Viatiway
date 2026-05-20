import { Request, Response } from 'express'
import { login, refresh, logout } from '../services/auth.service'
import { setAccessTokenCookie, setRefreshTokenCookie, clearTokenCookies } from '../lib/cookies'
import { AUTH_ERRORS, AppError } from '../lib/errors'

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: 'Brak danych' })
    return
  }

  try {
    const ip        = req.ip ?? 'unknown'
    const userAgent = req.headers['user-agent'] ?? 'unknown'

    const result = await login(email, password, ip, userAgent)

    setAccessTokenCookie(res, result.accessToken)
    setRefreshTokenCookie(res, result.refreshToken)

    res.status(200).json({ user: result.user })
  } catch (error) {
    if (error instanceof AppError) {
      const { httpStatus, message } = AUTH_ERRORS[error.code]
      res.status(httpStatus).json({ message })
      return
    }
    res.status(500).json({ message: 'Błąd serwera' })
  }
}

export async function refreshHandler(req: Request, res: Response): Promise<void> {
  const rawRefreshToken = req.cookies?.refresh_token

  if (!rawRefreshToken) {
    res.status(401).json({ message: AUTH_ERRORS.INVALID_REFRESH_TOKEN.message })
    return
  }

  try {
    const ip        = req.ip ?? 'unknown'
    const userAgent = req.headers['user-agent'] ?? 'unknown'

    const tokens = await refresh(rawRefreshToken, ip, userAgent)

    setAccessTokenCookie(res, tokens.accessToken)
    setRefreshTokenCookie(res, tokens.refreshToken)

    res.status(200).json({ message: 'Token odświeżony' })
  } catch (error) {
    if (error instanceof AppError) {
      const { httpStatus, message } = AUTH_ERRORS[error.code]
      clearTokenCookies(res)
      res.status(httpStatus).json({ message })
      return
    }
    res.status(500).json({ message: 'Błąd serwera' })
  }
}

export function meHandler(req: Request, res: Response): void {
  res.status(200).json({ user: req.user })
}

export async function logoutHandler(req: Request, res: Response): Promise<void> {
  const rawRefreshToken = req.cookies?.refresh_token

  if (rawRefreshToken) {
    await logout(rawRefreshToken).catch(() => {})
  }

  clearTokenCookies(res)
  res.status(200).json({ message: 'Wylogowano' })
}
