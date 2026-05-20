export const AUTH_ERRORS = {
  INVALID_CREDENTIALS:    { httpStatus: 401, message: 'Nieprawidłowy email lub hasło' },
  ACCOUNT_LOCKED:         { httpStatus: 423, message: 'Konto tymczasowo zablokowane - spróbuj za 15 minut' },
  ACCOUNT_INACTIVE:       { httpStatus: 403, message: 'Konto nieaktywne - skontaktuj się z administratorem' },
  INVALID_REFRESH_TOKEN:  { httpStatus: 401, message: 'Sesja wygasła - zaloguj się ponownie' },
  TOKEN_REUSE_DETECTED:   { httpStatus: 401, message: 'Sesja zakończona z powodów bezpieczeństwa' },
  SAME_AS_OLD_PASSWORD:   { httpStatus: 400, message: 'Nowe hasło musi się różnić od obecnego' },
  USER_NOT_FOUND:         { httpStatus: 500, message: 'Wystąpił błąd serwera' },
} as const

export type AuthErrorCode = keyof typeof AUTH_ERRORS

export class AppError extends Error {
  constructor(public readonly code: AuthErrorCode) {
    super(AUTH_ERRORS[code].message)
    this.name = 'AppError'
  }
}