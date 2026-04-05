"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon, CheckIcon } from "@/components/icons";

const DOWNLOAD_URL =
  "https://mwgbjlwwctjqzjnjqbhk.supabase.co/storage/v1/object/public/releases/geul-playground-latest.zip";

export default function DownloadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Section 1: Header */}
      <div className="mb-16">
        <span className="bg-geul-primary/10 text-geul-primary rounded-full px-3 py-1 font-mono text-sm">
          플레이그라운드 패키지
        </span>
        <h1 className="text-3xl font-bold text-geul-text mt-4 mb-2">
          글 다운로드
        </h1>
        <p className="text-geul-text-secondary">
          글 컴파일러와 웹 에이전트를 다운로드하여 플레이그라운드에서 바로
          코드를 작성하고 빌드하세요.
        </p>
      </div>

      {/* Section 2: Download */}
      <div className="mb-16">
        <a href={DOWNLOAD_URL} download>
          <Button size="lg" className="gap-2">
            <DownloadIcon size={20} />
            컴파일러 + 에이전트 다운로드 (.zip)
          </Button>
        </a>
        <p className="text-xs text-geul-text-muted mt-3">
          네이티브컴파일러.exe + 글-에이전트.exe + 표준 라이브러리 포함
        </p>
      </div>

      {/* Section 3: What's included */}
      <div className="mb-16">
        <h2 className="text-lg font-semibold text-geul-text mb-4">
          패키지 구성
        </h2>
        <ul className="space-y-3 text-sm text-geul-text-secondary">
          <li className="flex items-start gap-3">
            <CheckIcon
              size={16}
              className="text-geul-primary shrink-0 mt-0.5"
            />
            <div>
              <span className="text-geul-text font-medium">
                네이티브컴파일러.exe
              </span>
              <span className="text-geul-text-muted">
                {" "}
                — .글 소스를 .exe로 직접 컴파일
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckIcon
              size={16}
              className="text-geul-primary shrink-0 mt-0.5"
            />
            <div>
              <span className="text-geul-text font-medium">
                글-에이전트.exe
              </span>
              <span className="text-geul-text-muted">
                {" "}
                — 웹 플레이그라운드 연동 로컬 서버
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckIcon
              size={16}
              className="text-geul-primary shrink-0 mt-0.5"
            />
            <div>
              <span className="text-geul-text font-medium">표준/</span>
              <span className="text-geul-text-muted">
                {" "}
                — 표준 라이브러리 (std.gl 포함)
              </span>
            </div>
          </li>
        </ul>
      </div>

      {/* Section 4: System requirements */}
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
            추가 요구 사항 없음 (MSVC 불필요)
          </li>
        </ul>
      </div>

      {/* Section 5: Installation steps */}
      <div>
        <h2 className="text-lg font-semibold text-geul-text mb-4">
          설치 방법
        </h2>
        <ol className="space-y-6 text-sm">
          <li className="flex gap-4">
            <span className="shrink-0 w-7 h-7 rounded-full bg-geul-primary/10 text-geul-primary font-mono text-sm flex items-center justify-center">
              1
            </span>
            <div className="pt-0.5 text-geul-text-secondary">
              위 버튼으로 .zip 파일을 다운로드하고 원하는 폴더에 압축 해제
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
              를 실행하여 로컬 서버 시작
            </div>
          </li>
          <li className="flex gap-4">
            <span className="shrink-0 w-7 h-7 rounded-full bg-geul-primary/10 text-geul-primary font-mono text-sm flex items-center justify-center">
              3
            </span>
            <div className="pt-0.5 text-geul-text-secondary">
              웹사이트의{" "}
              <a
                href="/playground"
                className="text-geul-primary hover:underline"
              >
                플레이그라운드
              </a>
              에 접속하여 코드 작성 및 빌드
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
