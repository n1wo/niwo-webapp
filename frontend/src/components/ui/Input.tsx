import type { ComponentPropsWithoutRef } from "react";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}

      <input
        className={`rounded-md border-0 bg-bkg1 px-3.5 sm:text-sm sm:leading-6 py-2 text-content1 ring-1 ring-inset ring-borderc1 placeholder:text-content1 placeholder:opacity-60 focus:outline-none focus:ring-1 focus:ring-accent1 ${className}`}
        {...props}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}