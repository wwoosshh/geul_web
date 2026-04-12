"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n";

export function RegisterForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError(t.auth.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(t.auth.passwordTooShort);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/confirmed`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError(t.auth.registerError);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <p className="text-geul-text">{t.auth.checkEmail}</p>
        <p className="text-sm text-geul-text-secondary">
          {t.auth.emailSent}
        </p>
        <Link
          href="/auth/login"
          className="text-sm text-geul-primary hover:underline"
        >
          {t.auth.goToLogin}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <Input
        label={t.auth.email}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.auth.emailPlaceholder}
        required
      />
      <Input
        label={t.auth.nickname}
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder={t.auth.nicknamePlaceholder}
        required
      />
      <Input
        label={t.auth.password}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t.auth.passwordMinLength}
        required
      />
      <Input
        label={t.auth.passwordConfirm}
        type="password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        placeholder={t.auth.passwordConfirmPlaceholder}
        required
      />

      {error && <p className="text-sm text-geul-error">{error}</p>}

      <Button type="submit" loading={loading} className="w-full">
        {t.auth.register}
      </Button>

      <p className="text-center text-sm text-geul-text-secondary mt-6">
        {t.auth.hasAccount}{" "}
        <Link
          href="/auth/login"
          className="text-sm text-geul-primary hover:underline"
        >
          {t.auth.login}
        </Link>
      </p>
    </form>
  );
}
