// Authentication types for login and account creation.

import type { User } from "./index";

export type AuthMode = "login" | "register";

export interface LoginForm {
  identifier: string;
  password: string;
  remember: boolean;
}

export interface RegisterForm {
  fullName: string;
  institution: string;
  /** Resolved from the institutions list; null when no match is available */
  institutionId?: number | null;
  email: string;
  departmentLevel: string;
  password: string;
  confirmPassword: string;
}

export interface Institution {
  id: number;
  name: string;
  short_code: string;
  state: string;
}

export interface AuthProfile {
  department: string;
  level: string;
  avatar?: string | null;
  institution: Institution | null;
}

// User returned by the backend after authentication.
export interface AuthUser extends User {
  profile?: AuthProfile | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

export interface AuthError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}