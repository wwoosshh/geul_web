import { type ReactNode } from "react";

interface BadgeProps {
  variant?: "default" | "primary" | "error" | "warning";
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default:
    "bg-geul-surface text-geul-text-secondary border border-geul-border",
  primary:
    "bg-geul-primary/10 text-geul-primary",
  error:
    "bg-geul-error/10 text-geul-error",
  warning:
    "bg-geul-warning/10 text-geul-warning",
};

export function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
