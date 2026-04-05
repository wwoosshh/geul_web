"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/docs/markdown-renderer";

export interface ChangelogSaveData {
  version: string;
  title: string;
  content: string;
  release_date: string;
}

interface ChangelogEntry extends ChangelogSaveData {
  id: string;
}

interface ChangelogEditorProps {
  entry?: ChangelogEntry;
  onSave: (data: ChangelogSaveData) => Promise<void>;
  onCancel: () => void;
}

export function ChangelogEditor({ entry, onSave, onCancel }: ChangelogEditorProps) {
  const [version, setVersion] = useState(entry?.version ?? "");
  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [releaseDate, setReleaseDate] = useState(
    entry?.release_date ?? new Date().toISOString().split("T")[0]
  );
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        version,
        title,
        content,
        release_date: releaseDate,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={handleSave} loading={saving} disabled={!version || !title}>
          {entry ? "저장" : "생성"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "편집" : "미리보기"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          취소
        </Button>
      </div>

      {showPreview ? (
        <div className="bg-geul-surface border border-geul-border rounded-lg p-6 min-h-[200px]">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-geul-primary/10 text-geul-primary rounded-full px-3 py-1 font-mono text-sm">
              {version}
            </span>
            <span className="text-sm text-geul-text-muted">{releaseDate}</span>
          </div>
          <h2 className="text-lg font-semibold text-geul-text mb-3">{title}</h2>
          <MarkdownRenderer content={content} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="버전"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="v0.1.0"
            />
            <Input
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="릴리스 제목"
            />
            <Input
              label="릴리스 날짜"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <Textarea
            label="내용 (마크다운)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="변경 사항을 마크다운으로 작성하세요..."
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
