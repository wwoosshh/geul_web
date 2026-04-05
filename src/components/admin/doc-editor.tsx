"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/docs/markdown-renderer";

export interface DocSaveData {
  title: string;
  slug: string;
  content: string;
  category: string;
  sort_order: number;
  is_published: boolean;
}

interface Doc extends DocSaveData {
  id: string;
}

interface DocEditorProps {
  doc?: Doc;
  onSave: (data: DocSaveData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const CATEGORIES = ["시작하기", "문법", "표준라이브러리", "고급", "도구"];

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function DocEditor({ doc, onSave, onDelete }: DocEditorProps) {
  const [title, setTitle] = useState(doc?.title ?? "");
  const [slug, setSlug] = useState(doc?.slug ?? "");
  const [content, setContent] = useState(doc?.content ?? "");
  const [category, setCategory] = useState(doc?.category ?? "시작하기");
  const [sortOrder, setSortOrder] = useState(doc?.sort_order ?? 0);
  const [isPublished, setIsPublished] = useState(doc?.is_published ?? false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  // Auto-generate slug from title (only for new docs)
  useEffect(() => {
    if (!doc) {
      setSlug(toSlug(title));
    }
  }, [title, doc]);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        title,
        slug,
        content,
        category,
        sort_order: sortOrder,
        is_published: isPublished,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={handleSave} loading={saving}>
          {doc ? "저장" : "생성"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "편집" : "미리보기"}
        </Button>
        {doc && onDelete && (
          <Button variant="danger" onClick={onDelete}>
            삭제
          </Button>
        )}
      </div>

      {showPreview ? (
        <div className="bg-geul-surface border border-geul-border rounded-lg p-6 min-h-[400px]">
          <h1 className="text-2xl font-bold text-geul-text mb-4">{title}</h1>
          <MarkdownRenderer content={content} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문서 제목"
            />
            <Input
              label="슬러그"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="카테고리"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
            <Input
              label="정렬 순서"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-geul-border bg-geul-input accent-geul-primary"
                />
                <span className="text-sm text-geul-text-secondary">
                  게시됨
                </span>
              </label>
            </div>
          </div>

          <Textarea
            label="내용 (마크다운)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="마크다운으로 문서를 작성하세요..."
            className="min-h-[400px] font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
