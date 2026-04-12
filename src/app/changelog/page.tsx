import { createClient } from "@/lib/supabase/server";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";
import { MarkdownRenderer } from "@/components/docs/markdown";
import type { ChangelogEntry } from "@/types";

export default async function ChangelogPage() {
  const lang = await getServerLanguage();
  const t = translations[lang];

  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("changelog_entries")
    .select("*")
    .order("sort_order", { ascending: false });

  const changelog = (entries ?? []) as ChangelogEntry[];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-geul-text mb-2">{t.changelog.title}</h1>
      <p className="text-geul-text-secondary mb-12">
        {t.changelog.subtitle}
      </p>

      {changelog.length === 0 ? (
        <p className="text-geul-text-muted text-sm">
          {t.changelog.empty}
        </p>
      ) : (
        <div className="relative">
          {changelog.map((entry, index) => (
            <div key={entry.id} className="relative pl-8 pb-12 last:pb-0">
              {/* Vertical line */}
              {index < changelog.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 border-l-2 border-geul-border" />
              )}

              {/* Dot */}
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-geul-primary/10 border-2 border-geul-primary/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-geul-primary" />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="bg-geul-primary/10 text-geul-primary rounded-full px-3 py-1 font-mono text-sm">
                    {entry.version}
                  </span>
                  <span className="text-sm text-geul-text-muted">
                    {entry.release_date}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-geul-text mb-3">
                  {entry.title}
                </h2>
                {entry.content && (
                  <div className="text-geul-text-secondary">
                    <MarkdownRenderer content={entry.content} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
