"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon, TerminalIcon, CheckIcon } from "@/components/icons";

const INSTALL_COMMAND = `irm https://raw.githubusercontent.com/wwoosshh/geul-lang/main/install.ps1 | iex`;

export default function DownloadPage() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(INSTALL_COMMAND).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Section 1: Latest version */}
      <div className="mb-16">
        <span className="bg-geul-primary/10 text-geul-primary rounded-full px-3 py-1 font-mono text-sm">
          최신 버전
        </span>
        <h1 className="text-3xl font-bold text-geul-text mt-4 mb-2">
          글 다운로드
        </h1>
        <p className="text-geul-text-secondary">
          글 프로그래밍 언어 컴파일러와 에이전트를 설치하세요.
        </p>
      </div>

      {/* Section 2: Download options */}
      <div className="mb-16 space-y-8">
        <div>
          <a
            href="https://github.com/wwoosshh/geul-lang/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="gap-2">
              <DownloadIcon size={20} />
              컴파일러 + 에이전트 다운로드
            </Button>
          </a>
        </div>

        <div>
          <p className="text-sm text-geul-text-secondary mb-3 flex items-center gap-2">
            <TerminalIcon size={16} />
            PowerShell 한 줄 설치
          </p>
          <div className="relative bg-geul-surface border border-geul-border rounded-lg p-4 font-mono text-sm text-geul-text overflow-x-auto">
            <code>{INSTALL_COMMAND}</code>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-1.5 rounded bg-geul-bg border border-geul-border hover:border-geul-border-hover text-geul-text-secondary hover:text-geul-text transition-colors cursor-pointer"
              aria-label="복사"
            >
              {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: System requirements */}
      <div className="mb-16">
        <h2 className="text-lg font-semibold text-geul-text mb-4">
          시스템 요구 사항
        </h2>
        <ul className="space-y-2 text-geul-text-secondary text-sm">
          <li className="flex items-center gap-2">
            <CheckIcon size={16} className="text-geul-primary shrink-0" />
            Windows 10/11 (x64)
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon size={16} className="text-geul-primary shrink-0" />
            추가 요구 사항 없음
          </li>
        </ul>
      </div>

      {/* Section 4: Installation steps */}
      <div>
        <h2 className="text-lg font-semibold text-geul-text mb-4">
          설치 방법
        </h2>
        <ol className="space-y-4 text-sm">
          <li className="flex gap-4">
            <span className="shrink-0 w-7 h-7 rounded-full bg-geul-primary/10 text-geul-primary font-mono text-sm flex items-center justify-center">
              1
            </span>
            <div className="pt-0.5 text-geul-text-secondary">
              다운로드 후 압축 해제
            </div>
          </li>
          <li className="flex gap-4">
            <span className="shrink-0 w-7 h-7 rounded-full bg-geul-primary/10 text-geul-primary font-mono text-sm flex items-center justify-center">
              2
            </span>
            <div className="pt-0.5 text-geul-text-secondary">
              <code className="bg-geul-surface border border-geul-border rounded px-1.5 py-0.5 font-mono text-xs text-geul-text">
                글-에이전트.exe
              </code>{" "}
              실행
            </div>
          </li>
          <li className="flex gap-4">
            <span className="shrink-0 w-7 h-7 rounded-full bg-geul-primary/10 text-geul-primary font-mono text-sm flex items-center justify-center">
              3
            </span>
            <div className="pt-0.5 text-geul-text-secondary">
              웹사이트 플레이그라운드에서 코드 작성
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}

function CopyIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
