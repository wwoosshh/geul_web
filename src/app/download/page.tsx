"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon, CheckIcon } from "@/components/icons";
import { useLanguage } from "@/lib/i18n";

const DOWNLOAD_URL =
  "https://mwgbjlwwctjqzjnjqbhk.supabase.co/storage/v1/object/public/releases/geul-playground-latest.zip";

export default function DownloadPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Section 1: Header */}
      <div className="mb-16">
        <span className="bg-geul-primary/10 text-geul-primary rounded-full px-3 py-1 font-mono text-sm">
          {t.download.badge}
        </span>
        <h1 className="text-3xl font-bold text-geul-text mt-4 mb-2">
          {t.download.title}
        </h1>
        <p className="text-geul-text-secondary">
          {t.download.subtitle}
        </p>
      </div>

      {/* Section 2: Download */}
      <div className="mb-16">
        <a href={DOWNLOAD_URL} download>
          <Button size="lg" className="gap-2">
            <DownloadIcon size={20} />
            {t.download.button}
          </Button>
        </a>
        <p className="text-xs text-geul-text-muted mt-3">
          {t.download.includes}
        </p>
      </div>

      {/* Section 3: What's included */}
      <div className="mb-16">
        <h2 className="text-lg font-semibold text-geul-text mb-4">
          {t.download.packageTitle}
        </h2>
        <ul className="space-y-3 text-sm text-geul-text-secondary">
          {t.download.packageItems.map((item) => (
            <li key={item.name} className="flex items-start gap-3">
              <CheckIcon
                size={16}
                className="text-geul-primary shrink-0 mt-0.5"
              />
              <div>
                <span className="text-geul-text font-medium">
                  {item.name}
                </span>
                <span className="text-geul-text-muted">
                  {" "}{item.desc}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 4: System requirements */}
      <div className="mb-16">
        <h2 className="text-lg font-semibold text-geul-text mb-4">
          {t.download.requirementsTitle}
        </h2>
        <ul className="space-y-2 text-geul-text-secondary text-sm">
          {t.download.requirements.map((req) => (
            <li key={req} className="flex items-center gap-2">
              <CheckIcon size={16} className="text-geul-primary shrink-0" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Section 5: Installation steps */}
      <div>
        <h2 className="text-lg font-semibold text-geul-text mb-4">
          {t.download.installTitle}
        </h2>
        <ol className="space-y-6 text-sm">
          <li className="flex gap-4">
            <span className="shrink-0 w-7 h-7 rounded-full bg-geul-primary/10 text-geul-primary font-mono text-sm flex items-center justify-center">
              1
            </span>
            <div className="pt-0.5 text-geul-text-secondary">
              {t.download.installSteps[0]}
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
              {t.download.installSteps[1]}
            </div>
          </li>
          <li className="flex gap-4">
            <span className="shrink-0 w-7 h-7 rounded-full bg-geul-primary/10 text-geul-primary font-mono text-sm flex items-center justify-center">
              3
            </span>
            <div className="pt-0.5 text-geul-text-secondary">
              {t.download.websitePrefix}{" "}
              <a
                href="/playground"
                className="text-geul-primary hover:underline"
              >
                {t.download.webPlayground}
              </a>{" "}
              {t.download.installSteps[2]}
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
