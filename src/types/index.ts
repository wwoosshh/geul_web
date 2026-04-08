export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Doc {
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

export interface ForumPost {
  id: string;
  author_id: string;
  category: string;
  title: string;
  content: string;
  view_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface ForumComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  content: string;
  release_date: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ForumCategory = "notice" | "question" | "free" | "bug" | "project";

export const FORUM_CATEGORY_LABELS: Record<ForumCategory, string> = {
  notice: "공지",
  question: "질문 & 답변",
  free: "자유게시판",
  bug: "버그 리포트",
  project: "프로젝트 공유",
};

export const DOC_CATEGORIES = [
  "시작하기",
  "문법",
  "표준라이브러리",
  "고급",
  "도구",
] as const;

export type DocCategory = (typeof DOC_CATEGORIES)[number];
