import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getServerLanguage } from "@/lib/i18n/server";
import { translations } from "@/lib/i18n/translations";
import { MarkdownRenderer } from "@/components/docs/markdown";
import { Sidebar } from "@/components/docs/sidebar";
import { TableOfContents } from "@/components/docs/toc";

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const lang = await getServerLanguage();
  const t = translations[lang];
  const table = lang === "en" ? "docs_en" : "docs";

  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    slug = rawSlug;
  }
  slug = slug.trim();

  const supabase = await createClient();

  const { data: doc } = await supabase
    .from(table)
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!doc) {
    notFound();
  }

  const { data: docsList } = await supabase
    .from(table)
    .select("id, slug, title, category, sort_order")
    .eq("is_published", true)
    .order("sort_order");

  const allDocs = docsList ?? [];
  const currentIndex = allDocs.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc =
    currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  const content = doc.content.replace(/\r\n/g, "\n").trim();

  return (
    <div className="max-w-7xl mx-auto px-4 flex">
      <Sidebar currentSlug={slug} initialDocs={allDocs} lang={lang} />

      <article className="flex-1 min-w-0 py-6 lg:px-8">
        <h1 className="text-3xl font-bold text-geul-text mb-6">{doc.title}</h1>
        <MarkdownRenderer content={content} />

        <nav className="mt-16 pt-6 border-t border-geul-border flex justify-between gap-4">
          {prevDoc ? (
            <Link
              href={`/docs/${prevDoc.slug}`}
              className="flex-1 group rounded-lg border border-geul-border p-4 hover:border-geul-primary transition-colors"
            >
              <span className="text-xs text-geul-text-muted">{t.docs.prev}</span>
              <p className="text-geul-text group-hover:text-geul-primary transition-colors font-medium mt-1">
                {prevDoc.title}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {nextDoc ? (
            <Link
              href={`/docs/${nextDoc.slug}`}
              className="flex-1 group rounded-lg border border-geul-border p-4 hover:border-geul-primary transition-colors text-right"
            >
              <span className="text-xs text-geul-text-muted">{t.docs.next}</span>
              <p className="text-geul-text group-hover:text-geul-primary transition-colors font-medium mt-1">
                {nextDoc.title}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </article>

      <TableOfContents content={content} lang={lang} />
    </div>
  );
}
