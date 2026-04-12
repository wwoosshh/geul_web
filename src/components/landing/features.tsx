"use client";

import {
  DocumentIcon,
  TerminalIcon,
  LinkIcon,
  ChevronRightIcon,
  PlayIcon,
  CheckIcon,
} from "@/components/icons";
import { useLanguage } from "@/lib/i18n";

const featureIcons = [
  DocumentIcon,
  TerminalIcon,
  LinkIcon,
  ChevronRightIcon,
  PlayIcon,
  CheckIcon,
];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-geul-text mb-4">
          {t.features.title}
        </h2>
        <p className="text-geul-text-secondary mb-16 max-w-2xl">
          {t.features.subtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12">
          {t.features.items.map((feature, i) => {
            const Icon = featureIcons[i];
            return (
              <div key={feature.title}>
                <Icon className="text-geul-primary mb-3" size={20} />
                <h3 className="text-base font-semibold text-geul-text mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-geul-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
