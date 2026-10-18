import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Star } from 'lucide-react'
import BrandLogo from '../components/auth/BrandLogo'
import Field from '../components/auth/Field'
import PasswordField from '../components/auth/PasswordField'
import { ApiError, login, register, saveToken } from '../api/authApi'
import type { AuthMode, AuthUser, LoginForm, RegisterForm } from '../types/auth'
import './AuthPage.css'

interface AuthPageProps {
  initialMode?: AuthMode
  // Called after a successful sign in / sign up so the parent can route to Discover
  onAuthenticated: (user: AuthUser) => void
}

// Sample list for now. Swap for a GET /api/institutions/ call when the backend has one.
const INSTITUTIONS = [
  'University of Lagos (UNILAG)',
  'University of Ibadan (UI)',
  'Obafemi Awolowo University (OAU)',
  'Lagos State University (LASU)',
  'Covenant University',
  'Yaba College of Technology (YABATECH)',
  'Other',
]

const TAGLINE = 'Hire a classmate. Or turn your skills into campus income.'

// Maps backend field names (snake_case) to our form field names
const SERVER_FIELD_MAP: Record<string, string> = {
  identifier: 'identifier',
  full_name: 'fullName',
  institution: 'institution',
  email: 'email',
  department_level: 'departmentLevel',
  password: 'password',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = Record<string, string>

function validateLogin(form: LoginForm): Errors {
  const errors: Errors = {}
  if (!form.identifier.trim()) errors.identifier = 'Enter your email or username.'
  if (!form.password) errors.password = 'Enter your password.'
  return errors
}

function validateRegister(form: RegisterForm): Errors {
  const errors: Errors = {}
  if (form.fullName.trim().length < 2) errors.fullName = 'Enter your full name.'
  if (!form.institution) errors.institution = 'Select your campus.'
  if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Enter a valid student email.'
  if (!form.departmentLevel.trim()) errors.departmentLevel = 'Enter your department and level.'
  if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  return errors
}

export default function AuthPage({ initialMode = 'login', onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [loginForm, setLoginForm] = useState<LoginForm>({ identifier: '', password: '', remember: true })
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    fullName: '',
    institution: '',
    email: '',
    departmentLevel: '',
    password: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const uid = useId()

  const id = (name: string) => `${uid}-${name}`

  function switchMode(next: AuthMode) {
    if (next === mode) return
    setMode(next)
    setErrors({})
    setServerError('')
  }

  function updateLogin<K extends keyof LoginForm>(key: K, value: LoginForm[K]) {
    setLoginForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  function updateRegister<K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) {
    setRegisterForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError('')

    const found = mode === 'login' ? validateLogin(loginForm) : validateRegister(registerForm)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      const res = mode === 'login' ? await login(loginForm) : await register(registerForm)
      saveToken(res.token, mode === 'login' ? loginForm.remember : true)
      onAuthenticated(res.user)
    } catch (err) {
      if (err instanceof ApiError) {
        const mapped: Errors = {}
        for (const [key, message] of Object.entries(err.fieldErrors)) {
          mapped[SERVER_FIELD_MAP[key] ?? key] = message
        }
        if (Object.keys(mapped).length > 0) {
          setErrors(mapped)
        } else {
          setServerError(err.message)
        }
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className="auth-page">
      {/* ---------- Left: brand panel (hidden on mobile) ---------- */}
      <aside className="auth-hero">
        <span className="auth-hero__orb" aria-hidden="true" />
        <BrandLogo variant="light" />

        <div className="auth-hero__body">
          <h1 className="auth-hero__title">{TAGLINE}</h1>
          <figure className="auth-testimonial">
            <div className="auth-testimonial__head">
              <span className="auth-testimonial__avatar">DO</span>
              <div>
                <figcaption className="auth-testimonial__name">David Okafor</figcaption>
                <span className="auth-testimonial__meta">300L CompSci</span>
              </div>
              <div className="auth-testimonial__stars" aria-label="5 out of 5 stars">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
            </div>
            <blockquote className="auth-testimonial__quote">
              “I made ₦35,000 designing flyers for society events last week.”
            </blockquote>
          </figure>
        </div>

        <p className="auth-hero__foot">One account. Offer your skills and hire others, no separate sign-ups.</p>
      </aside>

      {/* ---------- Right: form ---------- */}
      <main className="auth-main">
        <div className="auth-mobile-brand">
          <BrandLogo />
          <p>{TAGLINE}</p>
        </div>

        <section className="auth-card">
          <div className="auth-tabs" role="tablist" aria-label="Sign in or create an account">
            <button
              type="button"
              role="tab"
              id={id('tab-login')}
              aria-selected={isLogin}
              aria-controls={id('panel')}
              className={`auth-tabs__tab${isLogin ? ' is-active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              id={id('tab-register')}
              aria-selected={!isLogin}
              aria-controls={id('panel')}
              className={`auth-tabs__tab${!isLogin ? ' is-active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Create Account
            </button>
          </div>

          <div id={id('panel')} role="tabpanel" aria-labelledby={id(isLogin ? 'tab-login' : 'tab-register')}>
            <h2 className="auth-card__title">{isLogin ? 'Welcome back' : 'Join your campus marketplace'}</h2>

            {serverError && (
              <div className="auth-alert" role="alert">
                {serverError}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {isLogin ? (
                <>
                  <Field label="Email or username" htmlFor={id('identifier')} error={errors.identifier}>
                    <input
                      id={id('identifier')}
                      className="auth-input"
                      type="text"
                      value={loginForm.identifier}
                      placeholder="Enter your email or username"
                      autoComplete="username"
                      aria-invalid={errors.identifier ? true : undefined}
                      onChange={(e) => updateLogin('identifier', e.target.value)}
                    />
                  </Field>

                  <PasswordField
                    value={loginForm.password}
                    onChange={(v) => updateLogin('password', v)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    error={errors.password}
                  />

                  <div className="auth-row">
                    <label className="auth-check">
                      <input
                        type="checkbox"
                        checked={loginForm.remember}
                        onChange={(e) => updateLogin('remember', e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>
                    <button type="button" className="auth-link" onClick={() => alert('Password reset is coming soon.')}>
                      Forgot password?
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Field label="Full name" htmlFor={id('fullName')} error={errors.fullName}>
                    <input
                      id={id('fullName')}
                      className="auth-input"
                      type="text"
                      value={registerForm.fullName}
                      placeholder="e.g. David Okafor"
                      autoComplete="name"
                      aria-invalid={errors.fullName ? true : undefined}
                      onChange={(e) => updateRegister('fullName', e.target.value)}
                    />
                  </Field>

                  <Field label="Campus / Institution" htmlFor={id('institution')} error={errors.institution}>
                    <select
                      id={id('institution')}
                      className="auth-input auth-select"
                      value={registerForm.institution}
                      aria-invalid={errors.institution ? true : undefined}
                      onChange={(e) => updateRegister('institution', e.target.value)}
                    >
                      <option value="">Select your university</option>
                      {INSTITUTIONS.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Student email" htmlFor={id('email')} error={errors.email}>
                    <input
                      id={id('email')}
                      className="auth-input"
                      type="email"
                      value={registerForm.email}
                      placeholder="yourname@student.edu.ng"
                      autoComplete="email"
                      aria-invalid={errors.email ? true : undefined}
                      onChange={(e) => updateRegister('email', e.target.value)}
                    />
                  </Field>

                  <Field label="Department & level" htmlFor={id('departmentLevel')} error={errors.departmentLevel}>
                    <input
                      id={id('departmentLevel')}
                      className="auth-input"
                      type="text"
                      value={registerForm.departmentLevel}
                      placeholder="e.g. Computer Science, 300L"
                      aria-invalid={errors.departmentLevel ? true : undefined}
                      onChange={(e) => updateRegister('departmentLevel', e.target.value)}
                    />
                  </Field>

                  <PasswordField
                    value={registerForm.password}
                    onChange={(v) => updateRegister('password', v)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    error={errors.password}
                    hint="Must be at least 8 characters"
                  />
                </>
              )}

              <button type="submit" className="auth-submit" disabled={submitting}>
                {submitting
                  ? isLogin
                    ? 'Signing in…'
                    : 'Creating account…'
                  : isLogin
                    ? 'Sign In'
                    : 'Create Student Account'}
              </button>
            </form>

            {!isLogin && (
              <p className="auth-terms">
                By joining, you agree to the CampusSkill{' '}
                <a href="#guidelines" onClick={(e) => e.preventDefault()}>
                  Student Community Guidelines
                </a>
                .
              </p>
            )}

            <p className="auth-switch">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button type="button" className="auth-link" onClick={() => switchMode(isLogin ? 'register' : 'login')}>
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
