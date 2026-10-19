// Types for the login / create-account screens.
// Kept in their own file so they never clash with types/index.ts (the shared API contract).
import type { User } from './index'

export type AuthMode = 'login' | 'register'

export interface LoginForm {
  identifier: string // email OR username
  password: string
  remember: boolean
}

export interface RegisterForm {
  fullName: string
  institution: string
  email: string
  departmentLevel: string // e.g. "Computer Science, 300L"
  password: string
}

export type AuthUser = User

// What we expect back from POST /api/auth/login/ and /api/auth/register/
// (the backend auth dev can adjust this, just tell the frontend team)
export interface AuthResponse {
  token: string
  user: AuthUser
}
