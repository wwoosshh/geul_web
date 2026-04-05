"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
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
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
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
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <p className="text-geul-text">이메일을 확인해주세요.</p>
        <p className="text-sm text-geul-text-secondary">
          가입 확인 링크가 이메일로 전송되었습니다.
        </p>
        <Link
          href="/auth/login"
          className="text-sm text-geul-primary hover:underline"
        >
          로그인 페이지로 이동
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <Input
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@example.com"
        required
      />
      <Input
        label="닉네임"
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="닉네임을 입력하세요"
        required
      />
      <Input
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="최소 6자 이상"
        required
      />
      <Input
        label="비밀번호 확인"
        type="password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        placeholder="비밀번호를 다시 입력하세요"
        required
      />

      {error && <p className="text-sm text-geul-error">{error}</p>}

      <Button type="submit" loading={loading} className="w-full">
        회원가입
      </Button>

      <p className="text-center text-sm text-geul-text-secondary mt-6">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/auth/login"
          className="text-sm text-geul-primary hover:underline"
        >
          로그인
        </Link>
      </p>
    </form>
  );
}
