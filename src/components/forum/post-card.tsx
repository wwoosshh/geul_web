import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format";
import type { ForumPost, ForumCategory } from "@/types";
import { FORUM_CATEGORY_LABELS } from "@/types";

interface PostCardProps {
  post: ForumPost;
}

const categoryVariant: Record<string, "default" | "primary" | "error" | "warning"> = {
  notice: "error",
  question: "primary",
  free: "default",
  bug: "warning",
  project: "primary",
};

export function PostCard({ post }: PostCardProps) {
  const category = post.category as ForumCategory;
  const label = FORUM_CATEGORY_LABELS[category] || post.category;
  const variant = categoryVariant[category] || "default";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-geul-border">
      {post.is_pinned && (
        <span className="text-xs text-geul-primary font-medium shrink-0">[고정]</span>
      )}
      <Badge variant={variant} className="shrink-0">
        {label}
      </Badge>
      <Link
        href={`/forum/${post.category}/${post.id}`}
        className="flex-1 min-w-0 text-sm text-geul-text hover:text-geul-primary transition-colors truncate"
      >
        {post.title}
      </Link>
      <div className="flex items-center gap-3 text-xs text-geul-text-muted shrink-0">
        <span>{post.author?.nickname || "익명"}</span>
        <span>{formatRelativeTime(post.created_at)}</span>
        <span>조회 {post.view_count}</span>
      </div>
    </div>
  );
}
