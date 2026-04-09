import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarkdownRenderer } from "@/components/docs/markdown";
import { Sidebar } from "@/components/docs/sidebar";
import { TableOfContents } from "@/components/docs/toc";

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;

  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    slug = rawSlug;
  }
  slug = slug.trim();

  const supabase = await createClient();

  const { data: doc } = await supabase
    .from("docs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!doc) {
    notFound();
  }

  const { data: docsList } = await supabase
    .from("docs")
    .select("id, slug, title, category, sort_order")
    .eq("is_published", true)
    .order("category")
    .order("sort_order");

  return (
    <div className="max-w-7xl mx-auto px-4 flex">
      <Sidebar currentSlug={slug} initialDocs={docsList ?? []} />

      <article className="flex-1 min-w-0 py-6 lg:px-8">
        <h1 className="text-3xl font-bold text-geul-text mb-6">{doc.title}</h1>
        <MarkdownRenderer content={doc.content.replace(/\r\n/g, '\n').trim()} />
      </article>

      <TableOfContents content={doc.content.replace(/\r\n/g, '\n').trim()} />
    </div>
  );
}
