import { PostList } from "@/components/forum/post-list";

export const metadata = {
  title: "포럼 - 글 프로그래밍 언어",
  description: "글 프로그래밍 언어 커뮤니티 포럼",
};

export default function ForumPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-geul-text mb-6">포럼</h1>
      <PostList />
    </div>
  );
}
