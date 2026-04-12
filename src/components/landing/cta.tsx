"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-geul-text mb-4">
          {t.cta.title}
        </h2>
        <p className="text-geul-text-secondary mb-10">
          {t.cta.subtitle}
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/download">
            <Button variant="primary" size="lg">
              {t.cta.download}
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="secondary" size="lg">
              {t.cta.viewDocs}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
