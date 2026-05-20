import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Permission } from '@prisma/client'

export interface AccessTokenPayLoad {
    id: string
    name: string
    email: string
    accessLevel: Permission
}

export function generateAccessToken(payload: AccessTokenPayLoad): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' })
}

export function verifyAccessToken(token: string): AccessTokenPayLoad {
  return jwt.verify(token, process.env.JWT_SECRET!) as AccessTokenPayLoad
}

export function generateRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex")
}

export function hashRefreshToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex')
}

export function getRefreshTokenExpiry(): Date {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 7)
  return expiry
}