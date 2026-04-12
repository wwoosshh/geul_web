import { createClient } from "@/lib/supabase/server";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";
import Link from "next/link";

export const dynamic = "force-dynamic";

type DocListItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  sort_order: number;
};

export default async function DocsPage() {
  const lang = await getServerLanguage();
  const t = translations[lang];
  const table = lang === "en" ? "docs_en" : "docs";

  let docs: DocListItem[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(table)
      .select("id, slug, title, category, sort_order")
      .eq("is_published", true)
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[docs] query error:", error);
    } else if (data) {
      docs = data as DocListItem[];
    }
  } catch (e) {
    console.error("[docs] unexpected error:", e);
  }

  const CATEGORIES = t.docs.categories;

  const grouped = CATEGORIES.reduce<Record<string, DocListItem[]>>(
    (acc, cat) => {
      acc[cat] = docs.filter((d) => d.category === cat);
      return acc;
    },
    {}
  );

  const totalCount = docs.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-geul-text mb-2">{t.docs.title}</h1>
        <p className="text-geul-text-secondary">
          {t.docs.subtitle}
        </p>
      </div>

      {totalCount === 0 ? (
        <p className="text-geul-text-muted text-sm">
          {t.docs.empty}
        </p>
      ) : (
        <div className="space-y-10">
          {CATEGORIES.map((cat) => {
            const items = grouped[cat];
            if (!items || items.length === 0) return null;
            return (
              <section key={cat}>
                <h2 className="text-sm font-semibold text-geul-text-muted uppercase tracking-wider mb-4">
                  {cat}
                </h2>
                <ul className="space-y-2 border-l border-geul-border pl-4">
                  {items.map((doc) => (
                    <li key={doc.id}>
                      <Link
                        href={`/docs/${encodeURIComponent(doc.slug)}`}
                        className="block text-geul-text-secondary hover:text-geul-primary transition-colors"
                      >
                        {doc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
