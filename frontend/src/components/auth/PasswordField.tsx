import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Field from './Field'

interface PasswordFieldProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  autoComplete: 'current-password' | 'new-password'
  error?: string
  hint?: string
}

export default function PasswordField({
  label = 'Password',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  hint,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const id = useId()

  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <div className="auth-input-wrap">
        <input
          id={id}
          className="auth-input auth-input--has-icon"
          type={visible ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="auth-input-wrap__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </Field>
  )
}
