"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitHubIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n";

export function LoginForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError(t.auth.loginError);
    } finally {
      setLoading(false);
    }
  }

  async function handleGitHubLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <form onSubmit={handleEmailLogin} className="space-y-4">
      <Input
        label={t.auth.email}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.auth.emailPlaceholder}
        required
      />
      <Input
        label={t.auth.password}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t.auth.passwordPlaceholder}
        required
      />

      {error && <p className="text-sm text-geul-error">{error}</p>}

      <Button type="submit" loading={loading} className="w-full">
        {t.auth.login}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-geul-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-geul-surface px-3 text-geul-text-secondary">
            {t.auth.or}
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full gap-2"
        onClick={handleGitHubLogin}
      >
        <GitHubIcon size={18} />
        {t.auth.githubLogin}
      </Button>

      <p className="text-center text-sm text-geul-text-secondary mt-6">
        {t.auth.noAccount}{" "}
        <Link
          href="/auth/register"
          className="text-geul-primary hover:underline"
        >
          {t.auth.register}
        </Link>
      </p>
    </form>
  );
}
