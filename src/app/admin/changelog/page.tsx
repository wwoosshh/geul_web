"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChangelogEditor, type ChangelogSaveData } from "@/components/admin/changelog-editor";

interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  content: string;
  release_date: string;
  created_at: string;
  updated_at: string;
}

export default function AdminChangelogPage() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<ChangelogEntry | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/changelog");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEntries(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function handleCreate(data: ChangelogSaveData) {
    const res = await fetch("/api/changelog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "생성 실패");
      return;
    }
    setCreating(false);
    fetchEntries();
  }

  async function handleUpdate(data: ChangelogSaveData) {
    if (!editingEntry) return;
    const res = await fetch(`/api/changelog/${editingEntry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "수정 실패");
      return;
    }
    setEditingEntry(null);
    fetchEntries();
  }

  async function handleDelete(entry: ChangelogEntry) {
    if (!confirm(`"${entry.version} - ${entry.title}" 항목을 삭제하시겠습니까?`)) return;
    const res = await fetch(`/api/changelog/${entry.id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "삭제 실패");
      return;
    }
    if (editingEntry?.id === entry.id) setEditingEntry(null);
    fetchEntries();
  }

  // Show editor inline when creating or editing
  if (creating) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-geul-text mb-6">새 버전 이력</h1>
        <ChangelogEditor onSave={handleCreate} onCancel={() => setCreating(false)} />
      </div>
    );
  }

  if (editingEntry) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-geul-text mb-6">버전 이력 편집</h1>
        <ChangelogEditor
          entry={editingEntry}
          onSave={handleUpdate}
          onCancel={() => setEditingEntry(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-geul-text">버전 이력 관리</h1>
        <Button onClick={() => setCreating(true)}>새 항목</Button>
      </div>

      {loading ? (
        <p className="text-geul-text-secondary text-sm">불러오는 중...</p>
      ) : entries.length === 0 ? (
        <p className="text-geul-text-secondary text-sm">등록된 버전 이력이 없습니다.</p>
      ) : (
        <div className="border border-geul-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-geul-surface">
              <tr>
                <th className="text-left px-4 py-2 text-geul-text-secondary font-medium">버전</th>
                <th className="text-left px-4 py-2 text-geul-text-secondary font-medium">제목</th>
                <th className="text-left px-4 py-2 text-geul-text-secondary font-medium hidden sm:table-cell">릴리스 날짜</th>
                <th className="text-right px-4 py-2 text-geul-text-secondary font-medium">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-geul-border">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-geul-surface/50 transition-colors">
                  <td className="px-4 py-2">
                    <span className="bg-geul-primary/10 text-geul-primary rounded-full px-2 py-0.5 font-mono text-xs">
                      {entry.version}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-geul-text">{entry.title}</td>
                  <td className="px-4 py-2 text-geul-text-secondary hidden sm:table-cell">
                    {entry.release_date}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingEntry(entry)}
                    >
                      편집
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(entry)}
                    >
                      삭제
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
