let refreshPromise: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = fetch('/api/v1/auth/refresh', {
    method:      'POST',
    credentials: 'include',
  })
    .then(r => r.ok)
    .catch(() => false)
    .finally(() => { refreshPromise = null })

  return refreshPromise
}

const AUTH_URLS = ['/api/v1/auth/login', '/api/v1/auth/refresh', '/api/v1/auth/logout']

async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (res.status === 401 && !AUTH_URLS.includes(url)) {
    const refreshed = await tryRefresh()

    if (refreshed) {
      return fetch(url, {
        ...options,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...options.headers },
      })
    }

    window.dispatchEvent(new Event('auth:expired'))
  }

  return res
}

export const api = {
  get:    (url: string)                 => apiFetch(url),
  post:   (url: string, body?: unknown) => apiFetch(url, { method: 'POST',   body: body !== undefined ? JSON.stringify(body) : undefined }),
  put:    (url: string, body?: unknown) => apiFetch(url, { method: 'PUT',    body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: (url: string)                 => apiFetch(url, { method: 'DELETE' }),
}
