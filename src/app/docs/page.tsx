import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const CATEGORIES = ["시작하기", "문법", "표준라이브러리", "고급", "도구"];

type DocListItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  sort_order: number;
};

export default async function DocsPage() {
  let docs: DocListItem[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("docs")
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

  // If there are docs, redirect to the first one.
  if (docs.length > 0) {
    redirect(`/docs/${docs[0].slug}`);
  }

  // Empty state
  const grouped = CATEGORIES.reduce<Record<string, DocListItem[]>>(
    (acc, cat) => {
      acc[cat] = docs.filter((d) => d.category === cat);
      return acc;
    },
    {}
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-geul-text mb-8">문서</h1>

      {docs.length === 0 && (
        <p className="text-geul-text-secondary">
          아직 등록된 문서가 없습니다.
        </p>
      )}

      {CATEGORIES.map((cat) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        return (
          <section key={cat} className="mb-8">
            <h2 className="text-lg font-semibold text-geul-text mb-3">{cat}</h2>
            <ul className="space-y-1">
              {items.map((doc) => (
                <li key={doc.id}>
                  <Link
                    href={`/docs/${doc.slug}`}
                    className="text-geul-text-secondary hover:text-geul-primary transition-colors text-sm"
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
  );
}
