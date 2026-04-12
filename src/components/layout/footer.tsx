"use client";

import { GitHubIcon } from "@/components/icons";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-geul-border text-geul-text-muted text-sm py-8">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <p>{t.footer.text}</p>
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
