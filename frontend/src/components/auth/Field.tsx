import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
}

// Label + input slot + error / hint text. Used by every field on the auth screens.
export default function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="auth-field">
      <label className="auth-field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="auth-field__error" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="auth-field__hint">{hint}</p>
      ) : null}
    </div>
  )
}
