"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/components/forum/post-card";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import type { ForumPost, ForumCategory } from "@/types";

interface PostListProps {
  initialCategory?: ForumCategory;
}

export function PostList({ initialCategory }: PostListProps) {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<ForumCategory | "all">(
    initialCategory || "all"
  );
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  const ALL_CATEGORIES: { key: ForumCategory | "all"; label: string }[] = [
    { key: "all", label: lang === "ko" ? "전체" : "All" },
    { key: "notice", label: t.forum.categories.notice },
    { key: "question", label: lang === "ko" ? "질문" : "Q&A" },
    { key: "free", label: lang === "ko" ? "자유" : "General" },
    { key: "bug", label: lang === "ko" ? "버그" : "Bug" },
    { key: "project", label: lang === "ko" ? "프로젝트" : "Project" },
  ];

  const fetchPosts = useCallback(async (category: ForumCategory | "all", page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (category !== "all") {
        params.set("category", category);
      }
      const res = await fetch(`/api/forum/posts?${params}`);
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(activeTab, currentPage);
  }, [activeTab, currentPage, fetchPosts]);

  function handleTabChange(key: ForumCategory | "all") {
    setActiveTab(key);
    setCurrentPage(1);
    if (key === "all") {
      router.push("/forum");
    } else {
      router.push(`/forum/${key}`);
    }
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="flex items-center gap-1 border-b border-geul-border mb-4">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleTabChange(cat.key)}
            className={`px-3 py-2 text-sm transition-colors ${
              activeTab === cat.key
                ? "text-geul-primary border-b-2 border-geul-primary font-medium"
                : "text-geul-text-secondary hover:text-geul-text"
            }`}
          >
            {cat.label}
          </button>
        ))}
        <div className="flex-1" />
        {isLoggedIn && (
          <Button size="sm" onClick={() => router.push("/forum/write")}>
            {t.forum.write}
          </Button>
        )}
      </div>

      {/* Post list */}
      {loading ? (
        <div className="py-12 text-center text-geul-text-muted text-sm">
          {lang === "ko" ? "불러오는 중..." : "Loading..."}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center text-geul-text-muted text-sm">
          {lang === "ko" ? "게시글이 없습니다." : "No posts yet."}
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
