"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostEditor } from "@/components/forum/post-editor";
import { createClient } from "@/lib/supabase/client";

export default function ForumWritePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setReady(true);
      }
    });
  }, [router]);

  if (!ready) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-geul-text-muted">확인 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-geul-text mb-6">글 작성</h1>
      <PostEditor />
    </div>
  );
}
