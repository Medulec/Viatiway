import bcrypt from 'bcrypt'
import prisma from '../lib/prisma'
import { generateAccessToken, generateRefreshToken, hashRefreshToken, getRefreshTokenExpiry } from '../lib/tokens'
import type { AccessTokenPayLoad } from '../lib/tokens'
import { AppError } from '../lib/errors'

const MAX_FAILED_ATTEMPTS  = 5
const LOCK_DURATION_MINUTES = 15

// ─── Typy zwracane przez serwis ───────────────────────────────────────────────

interface TokenPair {
  accessToken:  string
  refreshToken: string
}

interface LoginResult extends TokenPair {
  user: {
    id:          string
    name:        string
    email:       string
    accessLevel: string
  }
}

// ─── login ────────────────────────────────────────────────────────────────────

export async function login(
  email:     string,
  password:  string,
  ip:        string,
  userAgent: string,
): Promise<LoginResult> {

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) throw new AppError('INVALID_CREDENTIALS')

  if (!user.isActive) throw new AppError('ACCOUNT_INACTIVE')

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new AppError('ACCOUNT_LOCKED')
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

  if (!isPasswordValid) {
    await handleFailedLogin(user.id, user.failedLoginCount)
    throw new AppError('INVALID_CREDENTIALS')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginCount: 0,
      lockedUntil:      null,
      lastLoginAt:      new Date(),
    },
  })

  const tokens = await createTokenPair(user.id, ip, userAgent)

  return {
    ...tokens,
    user: {
      id:          user.id,
      name:        user.name,
      email:       user.email,
      accessLevel: user.accessLevel,
    },
  }
}

// ─── refresh ──────────────────────────────────────────────────────────────────

export async function refresh(
  rawRefreshToken: string,
  ip:              string,
  userAgent:       string,
): Promise<TokenPair> {

  const tokenHash = hashRefreshToken(rawRefreshToken)

  const stored = await prisma.refreshToken.findUnique({
    where:   { tokenHash },
    include: { user: true },
  })

  if (!stored) throw new AppError('INVALID_REFRESH_TOKEN')

  if (stored.revokedAt) {
    await revokeAllUserTokens(stored.userId)
    throw new AppError('TOKEN_REUSE_DETECTED')
  }

  if (stored.expiresAt < new Date()) throw new AppError('INVALID_REFRESH_TOKEN')

  const tokens = await createTokenPair(stored.userId, ip, userAgent)

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data:  { revokedAt: new Date() },
  })

  return tokens
}

// ─── logout ───────────────────────────────────────────────────────────────────

export async function logout(rawRefreshToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(rawRefreshToken)

  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data:  { revokedAt: new Date() },
  })
}

// ─── Pomocniki ────────────────────────────────────────────────────────────────

async function handleFailedLogin(userId: string, currentCount: number): Promise<void> {
  const newCount   = currentCount + 1
  const shouldLock = newCount >= MAX_FAILED_ATTEMPTS

  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginCount: newCount,
      lockedUntil: shouldLock
        ? new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
        : null,
    },
  })
}

async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data:  { revokedAt: new Date() },
  })
}

async function createTokenPair(
  userId:    string,
  ip:        string,
  userAgent: string,
): Promise<TokenPair> {

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })

  const payload: AccessTokenPayLoad = {
    id:          user.id,
    name:        user.name,
    email:       user.email,
    accessLevel: user.accessLevel,
  }

  const accessToken  = generateAccessToken(payload)
  const refreshToken = generateRefreshToken()

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: getRefreshTokenExpiry(),
      ipAddress: ip,
      userAgent,
    },
  })

  return { accessToken, refreshToken }
}
