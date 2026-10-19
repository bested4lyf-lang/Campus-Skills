import { useState } from "react";
import type { FormEvent } from "react";
import type { LoginForm as LoginFormData } from "../../types/auth";
import AuthFormHeader from "./AuthFormHeader";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";

interface LoginFormProps {
onSubmit: (form: LoginFormData) => void | Promise<void>;
isLoading?: boolean;
error?: string;
}

export default function LoginForm({
onSubmit,
isLoading = false,
error,
}: LoginFormProps) {
const [identifier, setIdentifier] = useState("");
const [password, setPassword] = useState("");
const [remember, setRemember] = useState(true);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();


await onSubmit({
  identifier,
  password,
  remember,
});


}

return ( <div> <AuthFormHeader
     title="Welcome back"
     description="Sign in to your account and continue your learning journey."
   />


  <form onSubmit={handleSubmit} className="space-y-5">
    <AuthInput
      label="Email address or username"
      name="identifier"
      type="text"
      placeholder="Enter your email or username"
      autoComplete="username"
      value={identifier}
      onChange={(event) => setIdentifier(event.target.value)}
      required
      disabled={isLoading}
    />

    <div>
      <PasswordInput
        label="Password"
        name="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        disabled={isLoading}
      />

      <div className="mt-3 flex items-center justify-between gap-4">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-500">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border-line accent-brand-600 focus:ring-2 focus:ring-brand-500"
          />
          Remember me
        </label>

        <a
          href="/forgot-password"
          className="text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          Forgot password?
        </a>
      </div>
    </div>

    {error && (
      <div
        role="alert"
        className="rounded-xl border border-danger-500/20 bg-danger-500/5 px-4 py-3 text-sm text-danger-500"
      >
        {error}
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
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </button>
  </form>

  <p className="mt-8 text-center text-sm text-ink-500">
    Don't have an account?{" "}
    <a
      href="/register"
      className="font-bold text-brand-700 transition hover:text-brand-900"
    >
      Create an account
    </a>
  </p>
</div>


);
}
