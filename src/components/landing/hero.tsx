"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export default function Hero() {
  const { t } = useLanguage();

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
            {t.hero.title}
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-geul-text-secondary leading-relaxed max-w-2xl mx-auto">
          {t.hero.subtitle}
        </p>

        <p className="mt-8 text-sm text-geul-text-muted tracking-wide">
          {t.hero.tags}
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Link href="/docs">
            <Button variant="primary" size="lg">
              {t.hero.getStarted}
            </Button>
          </Link>
          <Link href="/playground">
            <Button variant="secondary" size="lg">
              {t.hero.playground}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
