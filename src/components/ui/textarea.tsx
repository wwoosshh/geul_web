"use client";

import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className = "", id, ...props }, ref) {
    const textareaId = id || label?.replace(/\s+/g, "-").toLowerCase();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm text-geul-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full min-h-[120px] bg-geul-input border rounded-md px-3 py-2 text-sm text-geul-text placeholder:text-geul-text-muted outline-none transition-colors resize-y ${
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
