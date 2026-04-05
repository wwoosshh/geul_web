import { PostList } from "@/components/forum/post-list";
import { FORUM_CATEGORY_LABELS } from "@/types";
import type { ForumCategory } from "@/types";

const VALID_CATEGORIES = new Set<string>(["notice", "question", "free", "bug", "project"]);

export default async function ForumCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!VALID_CATEGORIES.has(category)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-geul-text-muted">존재하지 않는 카테고리입니다.</p>
      </div>
    );
  }

  const label = FORUM_CATEGORY_LABELS[category as ForumCategory];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-geul-text mb-6">
        포럼 &mdash; {label}
      </h1>
      <PostList initialCategory={category as ForumCategory} />
    </div>
  );
}
