"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckIcon, DownloadIcon } from "@/components/icons";
import { AgentClient } from "@/lib/agent";

const STEPS = [
  {
    number: 1,
    title: "컴파일러 + 에이전트 다운로드",
    description: "다운로드 페이지에서 최신 버전을 받으세요.",
    link: { href: "/download", label: "다운로드 페이지로 이동" },
  },
  {
    number: 2,
    title: "압축 해제 후 설치",
    description: "다운로드한 파일을 원하는 위치에 압축 해제합니다.",
  },
  {
    number: 3,
    title: "글-에이전트 실행",
    description: null,
    code: "글-에이전트.exe",
  },
  {
    number: 4,
    title: "연결 확인",
    description: "에이전트가 실행된 후 아래 버튼을 클릭하세요.",
  },
];

export default function SetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  async function handleCheck() {
    setChecking(true);
    setError("");

    const agent = new AgentClient();
    const ok = await agent.connect();
    agent.disconnect();

    setChecking(false);

    if (ok) {
      router.push("/playground");
    } else {
      setError(
        "에이전트에 연결할 수 없습니다. 글-에이전트가 실행 중인지 확인해 주세요."
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-geul-text mb-2">
          플레이그라운드 설정
        </h1>
        <p className="text-geul-text-secondary text-sm">
          온라인 플레이그라운드를 사용하려면 로컬에서 글-에이전트를 실행해야
          합니다. 아래 단계를 따라 설정하세요.
        </p>
      </div>

      <ol className="space-y-8 mb-12">
        {STEPS.map((step) => (
          <li key={step.number} className="flex gap-4">
            <span className="shrink-0 w-8 h-8 rounded-full bg-geul-primary/10 text-geul-primary font-mono text-sm flex items-center justify-center">
              {step.number}
            </span>
            <div className="pt-0.5">
              <h3 className="text-sm font-semibold text-geul-text mb-1">
                {step.title}
              </h3>
              {step.description && (
                <p className="text-sm text-geul-text-secondary mb-2">
                  {step.description}
                </p>
              )}
              {step.code && (
                <code className="inline-block bg-geul-surface border border-geul-border rounded px-2 py-1 font-mono text-xs text-geul-text">
                  {step.code}
                </code>
              )}
              {step.link && (
                <Link
                  href={step.link.href}
                  className="inline-flex items-center gap-1.5 text-sm text-geul-primary hover:text-geul-primary-hover transition-colors"
                >
                  <DownloadIcon size={14} />
                  {step.link.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t border-geul-border pt-8">
        <Button onClick={handleCheck} loading={checking} className="gap-1.5">
          <CheckIcon size={16} />
          연결 확인
        </Button>

        {error && (
          <p className="mt-4 text-sm text-geul-error">{error}</p>
        )}
      </div>
    </div>
  );
}
