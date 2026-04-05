"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/components/forum/post-card";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { ForumPost, ForumCategory } from "@/types";
import { FORUM_CATEGORY_LABELS } from "@/types";

interface PostListProps {
  initialCategory?: ForumCategory;
}

const ALL_CATEGORIES: { key: ForumCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "notice", label: "공지" },
  { key: "question", label: "질문" },
  { key: "free", label: "자유" },
  { key: "bug", label: "버그" },
  { key: "project", label: "프로젝트" },
];

export function PostList({ initialCategory }: PostListProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ForumCategory | "all">(
    initialCategory || "all"
  );
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

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
            글 작성
          </Button>
        )}
      </div>

      {/* Post list */}
      {loading ? (
        <div className="py-12 text-center text-geul-text-muted text-sm">
          불러오는 중...
        </div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center text-geul-text-muted text-sm">
          게시글이 없습니다.
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
