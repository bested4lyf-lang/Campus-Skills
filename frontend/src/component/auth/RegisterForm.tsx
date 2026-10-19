import { useState } from "react";
import type { FormEvent } from "react";
import type { RegisterForm as RegisterFormData } from "../../types/auth";
import AuthFormHeader from "./AuthFormHeader";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";

interface RegisterFormProps {
onSubmit: (form: RegisterFormData) => void | Promise<void>;
isLoading?: boolean;
error?: string;
}

export default function RegisterForm({
onSubmit,
isLoading = false,
error,
}: RegisterFormProps) {
const [fullName, setFullName] = useState("");
const [institution, setInstitution] = useState("");
const [email, setEmail] = useState("");
const [departmentLevel, setDepartmentLevel] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [acceptedTerms, setAcceptedTerms] = useState(false);
const [validationError, setValidationError] = useState("");

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();
setValidationError("");


if (password !== confirmPassword) {
  setValidationError("Your passwords do not match.");
  return;
}

if (!acceptedTerms) {
  setValidationError("Please accept the Terms of Service to continue.");
  return;
}

await onSubmit({
  fullName,
  institution,
  email,
  departmentLevel,
  password,
  confirmPassword,
});


}

const formError = validationError || error;

return ( <div> <AuthFormHeader
     title="Create your account"
     description="Join Campus Skills to share your talents, learn from others, and discover opportunities."
   />

  <form onSubmit={handleSubmit} className="space-y-4">
    <AuthInput
      label="Full name"
      name="fullName"
      type="text"
      placeholder="Enter your full name"
      autoComplete="name"
      value={fullName}
      onChange={(event) => setFullName(event.target.value)}
      required
      disabled={isLoading}
    />

    <AuthInput
      label="Email address"
      name="email"
      type="email"
      placeholder="you@example.com"
      autoComplete="email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      required
      disabled={isLoading}
    />

    <AuthInput
      label="Institution"
      name="institution"
      type="text"
      placeholder="Enter your school or institution"
      autoComplete="organization"
      value={institution}
      onChange={(event) => setInstitution(event.target.value)}
      required
      disabled={isLoading}
    />

    <AuthInput
      label="Department and level"
      name="departmentLevel"
      type="text"
      placeholder="e.g. Computer Science, 300 level"
      value={departmentLevel}
      onChange={(event) => setDepartmentLevel(event.target.value)}
      required
      disabled={isLoading}
    />

    <PasswordInput
      label="Password"
      name="password"
      placeholder="Create a password"
      autoComplete="new-password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      minLength={8}
      required
      disabled={isLoading}
    />

    <PasswordInput
      label="Confirm password"
      name="confirmPassword"
      placeholder="Enter your password again"
      autoComplete="new-password"
      value={confirmPassword}
      onChange={(event) => setConfirmPassword(event.target.value)}
      minLength={8}
      required
      disabled={isLoading}
    />

    <label className="flex cursor-pointer items-start gap-3 pt-1 text-sm leading-6 text-ink-500">
      <input
        type="checkbox"
        checked={acceptedTerms}
        onChange={(event) => setAcceptedTerms(event.target.checked)}
        disabled={isLoading}
        className="mt-1 h-4 w-4 shrink-0 rounded border-line accent-brand-600 focus:ring-2 focus:ring-brand-500"
      />

      <span>
        I agree to the{" "}
        <a
          href="/terms"
          className="font-semibold text-brand-700 hover:text-brand-900"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="font-semibold text-brand-700 hover:text-brand-900"
        >
          Privacy Policy
        </a>
        .
      </span>
    </label>

    {formError && (
      <div
        role="alert"
        className="rounded-xl border border-danger-500/20 bg-danger-500/5 px-4 py-3 text-sm text-danger-500"
      >
        {formError}
      </div>
    )}

    <button
      type="submit"
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          />
          Creating account...
        </>
      ) : (
        "Create Account"
      )}
    </button>
  </form>

  <p className="mt-7 text-center text-sm text-ink-500">
    Already have an account?{" "}
    <a
      href="/login"
      className="font-bold text-brand-700 transition hover:text-brand-900"
    >
      Sign in
    </a>
  </p>
</div>


);
}
