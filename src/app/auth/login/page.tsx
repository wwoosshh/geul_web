"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useLanguage } from "@/lib/i18n";

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-geul-text text-center mb-8">
          {t.auth.login}
        </h1>
        <div className="bg-geul-surface border border-geul-border rounded-lg p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
