import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-geul-text mb-4">
          지금 시작하세요
        </h2>
        <p className="text-geul-text-secondary mb-10">
          Windows 10/11에서 바로 사용할 수 있습니다.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/download">
            <Button variant="primary" size="lg">
              다운로드
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="secondary" size="lg">
              문서 보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
