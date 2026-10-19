import { useState } from "react";
import type { InputHTMLAttributes } from "react";

interface PasswordInputProps
extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
label: string;
error?: string;
}

export default function PasswordInput({
label,
error,
id,
className = "",
...inputProps
}: PasswordInputProps) {
const [showPassword, setShowPassword] = useState(false);
const inputId = id ?? inputProps.name;

return ( <div className="w-full"> <label
     htmlFor={inputId}
     className="mb-2 block text-sm font-semibold text-ink-700"
   >
{label}
{inputProps.required && ( <span className="ml-1 text-danger-500" aria-hidden="true">
* </span>
)} </label>


  <div className="relative">
    <input
      {...inputProps}
      id={inputId}
      type={showPassword ? "text" : "password"}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${inputId}-error` : undefined}
      className={`w-full rounded-xl border bg-white px-4 py-3 pr-20 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface-subtle ${
        error ? "border-danger-500" : "border-line"
      } ${className}`}
    />

    <button
      type="button"
      onClick={() => setShowPassword((current) => !current)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      aria-pressed={showPassword}
      className="absolute inset-y-0 right-3 my-auto h-fit rounded-md px-2 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>

  {error && (
    <p
      id={`${inputId}-error`}
      className="mt-2 text-sm text-danger-500"
      role="alert"
    >
      {error}
    </p>
  )}
</div>


);
}
