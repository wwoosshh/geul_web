"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/docs/markdown-renderer";
import { CommentSection } from "@/components/forum/comment-section";
import { useAuth } from "@/lib/hooks/use-auth";
import type { ForumPost, ForumCategory } from "@/types";
import { FORUM_CATEGORY_LABELS } from "@/types";

const categoryVariant: Record<string, "default" | "primary" | "error" | "warning"> = {
  notice: "error",
  question: "primary",
  free: "default",
  bug: "warning",
  project: "primary",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { userId, isAdmin } = useAuth();

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const res = await fetch(`/api/forum/posts/${id}`);
        if (res.ok) {
          setPost(await res.json());
        }
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPost();
  }, [id]);

  async function handleDelete() {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/forum/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/forum");
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-geul-text-muted">불러오는 중...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-geul-text-muted">게시글을 찾을 수 없습니다.</p>
        <Link href="/forum" className="text-sm text-geul-primary hover:underline mt-2 inline-block">
          포럼으로 돌아가기
        </Link>
      </div>
    );
  }

  const category = post.category as ForumCategory;
  const canModify = post.author_id === userId || isAdmin;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={categoryVariant[category] || "default"}>
            {FORUM_CATEGORY_LABELS[category] || post.category}
          </Badge>
          {post.is_pinned && (
            <span className="text-xs text-geul-primary font-medium">[고정]</span>
          )}
        </div>
        <h1 className="text-xl font-bold text-geul-text mb-2">{post.title}</h1>
        <div className="flex items-center gap-3 text-xs text-geul-text-muted">
          <span>{post.author?.nickname || "익명"}</span>
          <span>{formatDate(post.created_at)}</span>
          <span>조회 {post.view_count}</span>
        </div>
      </div>

      {/* Content */}
      <div className="border-t border-geul-border pt-6 pb-4">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-geul-border pt-4">
        <Link
          href="/forum"
          className="text-sm text-geul-text-secondary hover:text-geul-text transition-colors"
        >
          목록으로
        </Link>
        {canModify && (
          <div className="flex items-center gap-2">
            <Button variant="danger" size="sm" onClick={handleDelete}>
              삭제
            </Button>
          </div>
        )}
      </div>

      {/* Comments */}
      <CommentSection postId={post.id} />
    </div>
  );
}
