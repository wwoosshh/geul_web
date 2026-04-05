import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "이메일 인증 완료 - 글",
};

export default function ConfirmedPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-geul-primary/10 border border-geul-primary/30">
        <CheckIcon size={32} className="text-geul-primary" />
      </div>

      <h1 className="text-2xl font-bold text-geul-text mb-3">
        이메일 인증이 완료되었습니다
      </h1>
      <p className="text-sm text-geul-text-secondary mb-10">
        이제 글 프로그래밍 언어의 모든 기능을 사용할 수 있습니다.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/">
          <Button variant="primary" className="w-full sm:w-auto">
            홈으로 이동
          </Button>
        </Link>
        <Link href="/playground">
          <Button variant="secondary" className="w-full sm:w-auto">
            플레이그라운드 시작
          </Button>
        </Link>
      </div>
    </div>
  );
}
