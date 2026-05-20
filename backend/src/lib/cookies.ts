import { Response } from 'express';

const is_production = process.env.NODE_ENV === 'production'

const access_token_age = 15*60
const refresh_token_max = 7 * 24 * 60 * 60

const base_options = {
    httpOnly: true,
    secure: is_production,
    sameSite: 'strict' as const
}

export function setAccessTokenCookie(res: Response, token: string): void {
    res.cookie('access_token', token, {
        ...base_options,
        path: '/',
        maxAge: access_token_age * 1000,
    })
}

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie('refresh_token', token, {
    ...base_options,
    path:   '/api/v1/auth',
    maxAge: refresh_token_max * 1000,
  })
}

export function clearTokenCookies(res: Response): void {
  res.clearCookie('access_token',  { path: '/' })
  res.clearCookie('refresh_token', { path: '/api/v1/auth' })
}