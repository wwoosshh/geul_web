import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative py-32 sm:py-40 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h1 className="mb-6">
          <span className="block text-8xl sm:text-9xl font-bold text-geul-primary tracking-tight">
            글
          </span>
          <span className="block mt-4 text-3xl sm:text-4xl font-semibold text-geul-text">
            프로그래밍 언어
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-geul-text-secondary leading-relaxed max-w-2xl mx-auto">
          한글로 프로그래밍하는 독자적 시스템 프로그래밍 언어
        </p>

        <p className="mt-8 text-sm text-geul-text-muted tracking-wide">
          100% 한글 키워드 &middot; SOV 어순 &middot; 네이티브 컴파일 &middot; 자체호스팅
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Link href="/docs">
            <Button variant="primary" size="lg">
              시작하기
            </Button>
          </Link>
          <Link href="/playground">
            <Button variant="secondary" size="lg">
              플레이그라운드
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
