"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { DocEditor, type DocSaveData } from "@/components/admin/doc-editor";

interface Doc {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminDocsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState<Doc | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all docs (including unpublished) via API
      const res = await fetch("/api/docs?all=1");
      const data = await res.json();
      if (Array.isArray(data)) {
        setDocs(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  async function handleCreate(data: DocSaveData) {
    const res = await fetch("/api/docs", {
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
    fetchDocs();
  }

  async function handleUpdate(data: DocSaveData) {
    if (!editingDoc) return;
    const res = await fetch(`/api/docs/${editingDoc.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "수정 실패");
      return;
    }
    setEditingDoc(null);
    fetchDocs();
  }

  async function handleDelete(doc: Doc) {
    if (!confirm(`"${doc.title}" 문서를 삭제하시겠습니까?`)) return;
    const res = await fetch(`/api/docs/${doc.id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "삭제 실패");
      return;
    }
    setEditingDoc(null);
    fetchDocs();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-geul-text">문서 관리</h1>
        <Button onClick={() => setCreating(true)}>새 문서</Button>
      </div>

      {loading ? (
        <p className="text-geul-text-secondary text-sm">불러오는 중...</p>
      ) : docs.length === 0 ? (
        <p className="text-geul-text-secondary text-sm">등록된 문서가 없습니다.</p>
      ) : (
        <div className="border border-geul-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-geul-surface">
              <tr>
                <th className="text-left px-4 py-2 text-geul-text-secondary font-medium">제목</th>
                <th className="text-left px-4 py-2 text-geul-text-secondary font-medium hidden sm:table-cell">카테고리</th>
                <th className="text-left px-4 py-2 text-geul-text-secondary font-medium hidden sm:table-cell">순서</th>
                <th className="text-left px-4 py-2 text-geul-text-secondary font-medium">상태</th>
                <th className="text-right px-4 py-2 text-geul-text-secondary font-medium">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-geul-border">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-geul-surface/50 transition-colors">
                  <td className="px-4 py-2 text-geul-text">{doc.title}</td>
                  <td className="px-4 py-2 text-geul-text-secondary hidden sm:table-cell">{doc.category}</td>
                  <td className="px-4 py-2 text-geul-text-secondary hidden sm:table-cell">{doc.sort_order}</td>
                  <td className="px-4 py-2">
                    {doc.is_published ? (
                      <Badge variant="primary">게시됨</Badge>
                    ) : (
                      <Badge>비공개</Badge>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingDoc(doc)}
                    >
                      편집
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(doc)}
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

      {/* Create modal */}
      <Modal
        isOpen={creating}
        onClose={() => setCreating(false)}
        title="새 문서"
      >
        <DocEditor onSave={handleCreate} />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editingDoc}
        onClose={() => setEditingDoc(null)}
        title="문서 편집"
      >
        {editingDoc && (
          <DocEditor
            doc={editingDoc}
            onSave={handleUpdate}
            onDelete={() => handleDelete(editingDoc)}
          />
        )}
      </Modal>
    </div>
  );
}
