import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ForumPost, ForumCategory } from "@/types";
import { FORUM_CATEGORY_LABELS } from "@/types";

interface PostCardProps {
  post: ForumPost;
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;

  return `${Math.floor(months / 12)}년 전`;
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
