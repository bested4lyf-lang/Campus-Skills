
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
  email: string;
  departmentLevel: string;
  password: string;
  confirmPassword: string;
}

// User returned by the backend after authentication.
export type AuthUser = User;

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface AuthError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

