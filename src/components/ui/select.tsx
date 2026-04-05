"use client";

import { type SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDownIcon } from "@/components/icons";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, className = "", id, children, ...props }, ref) {
    const selectId = id || label?.replace(/\s+/g, "-").toLowerCase();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm text-geul-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none bg-geul-input border rounded-md px-3 py-2 pr-10 text-sm text-geul-text outline-none transition-colors ${
              error
                ? "border-geul-error focus:border-geul-error"
                : "border-geul-border focus:border-geul-primary"
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDownIcon
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-geul-text-muted pointer-events-none"
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-geul-error">{error}</p>
        )}
      </div>
    );
  }
);
