"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className = "", id, ...props }, ref) {
    const inputId = id || label?.replace(/\s+/g, "-").toLowerCase();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm text-geul-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-geul-input border rounded-md px-3 py-2 text-sm text-geul-text placeholder:text-geul-text-muted outline-none transition-colors ${
            error
              ? "border-geul-error focus:border-geul-error"
              : "border-geul-border focus:border-geul-primary"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-geul-error">{error}</p>
        )}
      </div>
    );
  }
);
