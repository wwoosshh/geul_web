import { GitHubIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="border-t border-geul-border text-geul-text-muted text-sm py-8">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <p>글 프로그래밍 언어 &middot; MIT 라이선스</p>
        <a
          href="https://github.com/wwoosshh/geul-lang"
          target="_blank"
          rel="noopener noreferrer"
          className="text-geul-text-muted hover:text-geul-text transition-colors"
          aria-label="GitHub"
        >
          <GitHubIcon size={20} />
        </a>
      </div>
    </footer>
  );
}
