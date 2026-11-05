// Auth API calls for the login / create-account screens.
//   POST /api/auth/login/     { username (username or email), password }  -> { access, refresh, user }
//   POST /api/auth/register/  { username, email, password, first_name, last_name,
//                               institution_id, department, level }      -> { tokens: { access, refresh }, user }
//   GET  /api/auth/institutions/  (paginated)                             -> { results, next }
import type { AuthResponse, AuthTokens, AuthUser, Institution, LoginForm, RegisterForm } from '../types/auth'

const API_BASE: string = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'
const ACCESS_KEY = 'campusskill_token'
const REFRESH_KEY = 'campusskill_refresh'

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string>

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0)
  }

  const data: Record<string, unknown> = await res.json().catch(() => ({}))

  if (!res.ok) {
    // DRF returns either { detail: "..." } or { field: ["message"] }
    const fieldErrors: Record<string, string> = {}
    for (const [key, value] of Object.entries(data)) {
      if (key === 'detail' || key === 'non_field_errors') continue
      fieldErrors[key] = Array.isArray(value) ? String(value[0]) : String(value)
    }
    const nonField = data.non_field_errors
    const message =
      (typeof data.detail === 'string' && data.detail) ||
      (Array.isArray(nonField) && String(nonField[0])) ||
      Object.values(fieldErrors)[0] ||
      'Something went wrong. Please try again.'
    throw new ApiError(message, res.status, fieldErrors)
  }

  return data as T
}

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/)
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') }
}

// "Computer Science, 300 level" -> { department: "Computer Science", level: "300 level" }
export function splitDepartmentLevel(value: string): { department: string; level: string } {
  const comma = value.lastIndexOf(',')
  if (comma === -1) return { department: value.trim(), level: '' }
  return { department: value.slice(0, comma).trim(), level: value.slice(comma + 1).trim() }
}

export function login(form: LoginForm): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/login/', {
    username: form.identifier.trim(),
    password: form.password,
  })
}

export async function register(form: RegisterForm): Promise<AuthResponse> {
  const { first, last } = splitName(form.fullName)
  const { department, level } = splitDepartmentLevel(form.departmentLevel)
  const email = form.email.trim().toLowerCase()

  const data = await post<{ tokens: AuthTokens; user: AuthUser }>('/auth/register/', {
    username: email,
    email,
    password: form.password,
    first_name: first,
    last_name: last,
    institution_id: form.institutionId ?? null,
    department,
    level,
  })
  return { ...data.tokens, user: data.user }
}

interface InstitutionPage {
  results: Institution[]
  next: string | null
}

// The backend paginates 10 at a time, so follow "next" until there are no more pages.
export async function getInstitutions(): Promise<Institution[]> {
  const all: Institution[] = []
  let url: string | null = `${API_BASE}/auth/institutions/`

  for (let page = 0; url !== null && page < 10; page += 1) {
    try {
      const res: Response = await fetch(url)
      if (!res.ok) break
      const data = (await res.json()) as Institution[] | InstitutionPage
      if (Array.isArray(data)) return data
      all.push(...data.results)
      url = data.next
    } catch {
      break
    }
  }
  return all
}

// "Remember me" ticked -> localStorage (stays after closing the browser)
// otherwise -> sessionStorage (cleared when the tab closes)
export function saveTokens(tokens: AuthTokens, remember: boolean): void {
  const keep = remember ? localStorage : sessionStorage
  const drop = remember ? sessionStorage : localStorage
  drop.removeItem(ACCESS_KEY)
  drop.removeItem(REFRESH_KEY)
  keep.setItem(ACCESS_KEY, tokens.access)
  keep.setItem(REFRESH_KEY, tokens.refresh)
}

export function getToken(): string | null {
  return localStorage.getItem(ACCESS_KEY) ?? sessionStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY) ?? sessionStorage.getItem(REFRESH_KEY)
}

export function clearToken(): void {
  for (const store of [localStorage, sessionStorage]) {
    store.removeItem(ACCESS_KEY)
    store.removeItem(REFRESH_KEY)
  }
}