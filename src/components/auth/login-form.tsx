"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitHubIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
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
      setError("로그인 중 오류가 발생했습니다.");
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
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@example.com"
        required
      />
      <Input
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력하세요"
        required
      />

      {error && <p className="text-sm text-geul-error">{error}</p>}

      <Button type="submit" loading={loading} className="w-full">
        로그인
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-geul-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-geul-surface px-3 text-geul-text-secondary">
            또는
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
        GitHub로 로그인
      </Button>

      <p className="text-center text-sm text-geul-text-secondary mt-6">
        계정이 없으신가요?{" "}
        <Link
          href="/auth/register"
          className="text-geul-primary hover:underline"
        >
          회원가입
        </Link>
      </p>
    </form>
  );
}
