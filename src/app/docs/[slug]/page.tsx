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

  // Defensively decode in case Next.js didn't already.
  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    slug = rawSlug;
  }
  slug = slug.trim();

  const supabase = await createClient();

  // Primary query — exact match on published docs
  const { data: doc, error } = await supabase
    .from("docs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[docs/[slug]] query error:", JSON.stringify(error), "slug=", slug);
  }

  if (!doc) {
    // Diagnostic: fetch all published doc slugs so we can see the mismatch.
    const { data: allDocs } = await supabase
      .from("docs")
      .select("slug, title, is_published")
      .eq("is_published", true);
    console.warn(
      "[docs/[slug]] notFound — rawSlug:",
      JSON.stringify(rawSlug),
      "decodedSlug:",
      JSON.stringify(slug),
      "slugLen:",
      slug.length,
      "slugCharCodes:",
      [...slug].map((c) => c.charCodeAt(0)).join(","),
      "availablePublished:",
      JSON.stringify(allDocs)
    );
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 flex">
      <Sidebar currentSlug={slug} />

      <article className="flex-1 min-w-0 py-6 lg:px-8">
        <h1 className="text-3xl font-bold text-geul-text mb-6">{doc.title}</h1>
        <MarkdownRenderer content={doc.content} />
      </article>

      <TableOfContents content={doc.content} />
    </div>
  );
}
