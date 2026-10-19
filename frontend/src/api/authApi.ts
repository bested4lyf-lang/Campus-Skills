// Auth API calls for the login / create-account screens.
// Endpoints below are PLACEHOLDERS until the backend auth dev confirms them:
//   POST /api/auth/login/     { identifier, password }
//   POST /api/auth/register/  { full_name, institution, email, department_level, password }
// Both should return { token, user }.
import type { AuthResponse, LoginForm, RegisterForm } from '../types/auth'

const API_BASE: string = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'
const TOKEN_KEY = 'campusskill_token'

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
      'Something went wrong. Please try again.'
    throw new ApiError(message, res.status, fieldErrors)
  }

  return data as T
}

export function login(form: LoginForm): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/login/', {
    identifier: form.identifier.trim(),
    password: form.password,
  })
}

export function register(form: RegisterForm): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/register/', {
    full_name: form.fullName.trim(),
    institution: form.institution,
    email: form.email.trim(),
    department_level: form.departmentLevel.trim(),
    password: form.password,
  })
}

// "Remember me" ticked -> localStorage (stays after closing the browser)
// otherwise -> sessionStorage (cleared when the tab closes)
export function saveToken(token: string, remember: boolean): void {
  const store = remember ? localStorage : sessionStorage
  store.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}
