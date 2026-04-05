"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/docs/markdown-renderer";
import type { ForumCategory, ForumPost } from "@/types";
import { FORUM_CATEGORY_LABELS } from "@/types";

interface PostEditorProps {
  post?: ForumPost;
}

const CATEGORIES: ForumCategory[] = ["notice", "question", "free", "bug", "project"];

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const [category, setCategory] = useState<ForumCategory>(
    (post?.category as ForumCategory) || "free"
  );
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!post;

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/forum/posts/${post.id}` : "/api/forum/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title: title.trim(), content: content.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "오류가 발생했습니다.");
        return;
      }

      const targetCategory = data.category || category;
      const targetId = data.id || post?.id;
      router.push(`/forum/${targetCategory}/${targetId}`);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-48">
          <Select
            label="카테고리"
            value={category}
            onChange={(e) => setCategory(e.target.value as ForumCategory)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {FORUM_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex-1">
          <Input
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-geul-border pb-2">
        <button
          onClick={() => setPreview(false)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            !preview
              ? "text-geul-primary bg-geul-primary/10"
              : "text-geul-text-secondary hover:text-geul-text"
          }`}
        >
          작성
        </button>
        <button
          onClick={() => setPreview(true)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            preview
              ? "text-geul-primary bg-geul-primary/10"
              : "text-geul-text-secondary hover:text-geul-text"
          }`}
        >
          미리보기
        </button>
      </div>

      {preview ? (
        <div className="min-h-[320px] border border-geul-border rounded-md p-4">
          {content.trim() ? (
            <MarkdownRenderer content={content} />
          ) : (
            <p className="text-geul-text-muted text-sm">미리볼 내용이 없습니다.</p>
          )}
        </div>
      ) : (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="마크다운으로 작성할 수 있습니다."
          className="min-h-[320px]"
        />
      )}

      {error && <p className="text-sm text-geul-error">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => router.back()}>
          취소
        </Button>
        <Button loading={loading} onClick={handleSubmit}>
          {isEdit ? "수정" : "작성"}
        </Button>
      </div>
    </div>
  );
}
