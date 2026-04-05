"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownRenderer } from "@/components/docs/markdown-renderer";
import { createClient } from "@/lib/supabase/client";
import type { ForumComment } from "@/types";

interface CommentSectionProps {
  postId: string;
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

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === "admin");
          });
      }
    });
  }, []);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/comments?post_id=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit() {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/forum/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, content: content.trim() }),
      });
      if (res.ok) {
        setContent("");
        fetchComments();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/forum/comments?id=${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchComments();
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-sm font-medium text-geul-text mb-4">
        댓글 {comments.length > 0 && `(${comments.length})`}
      </h3>

      {loading ? (
        <p className="text-sm text-geul-text-muted py-4">불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-geul-text-muted py-4">아직 댓글이 없습니다.</p>
      ) : (
        <div className="space-y-0">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="py-3 border-b border-geul-border"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-xs text-geul-text-muted">
                  <span className="text-geul-text-secondary font-medium">
                    {comment.author?.nickname || "익명"}
                  </span>
                  <span>{formatRelativeTime(comment.created_at)}</span>
                </div>
                {(comment.author_id === userId || isAdmin) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-geul-text-muted hover:text-geul-error transition-colors"
                  >
                    삭제
                  </button>
                )}
              </div>
              <div className="text-sm">
                <MarkdownRenderer content={comment.content} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write form */}
      <div className="mt-6">
        {userId ? (
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="댓글을 작성하세요. 마크다운을 사용할 수 있습니다."
              className="min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                loading={submitting}
                onClick={handleSubmit}
                disabled={!content.trim()}
              >
                댓글 작성
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-geul-text-muted py-4 text-center border border-geul-border rounded-md">
            로그인이 필요합니다
          </p>
        )}
      </div>
    </div>
  );
}
