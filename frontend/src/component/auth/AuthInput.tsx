import type { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
label: string;
error?: string;
}

export default function AuthInput({
label,
error,
id,
className = "",
...inputProps
}: AuthInputProps) {
const inputId = id ?? inputProps.name;

return ( <div className="w-full"> <label
     htmlFor={inputId}
     className="mb-2 block text-sm font-semibold text-ink-700"
   >
{label}
{inputProps.required && ( <span className="ml-1 text-danger-500" aria-hidden="true">
* </span>
)} </label>


  <input
    {...inputProps}
    id={inputId}
    aria-invalid={Boolean(error)}
    aria-describedby={error ? `${inputId}-error` : undefined}
    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface-subtle ${
      error ? "border-danger-500" : "border-line"
    } ${className}`}
  />

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
