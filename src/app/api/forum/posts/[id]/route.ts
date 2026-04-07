import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Increment view count atomically (best-effort)
  await supabase.rpc("increment_view_count", { post_id: id });

  // Fetch post
  const { data, error } = await supabase
    .from("forum_posts")
    .select("*, author:profiles(id, nickname, avatar_url, role)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

async function getAuthContext(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { user, isAdmin: profile?.role === "admin" };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const auth = await getAuthContext(supabase);
  if (!auth) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  // Check ownership or admin
  const { data: post } = await supabase
    .from("forum_posts")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!post) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 });
  }

  if (post.author_id !== auth.user.id && !auth.isAdmin) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  const body = await request.json();
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.title !== undefined) updateData.title = body.title;
  if (body.content !== undefined) updateData.content = body.content;
  if (body.category !== undefined) {
    if (body.category === "notice" && !auth.isAdmin) {
      return NextResponse.json({ error: "공지 카테고리는 관리자만 설정할 수 있습니다" }, { status: 403 });
    }
    updateData.category = body.category;
  }

  // is_pinned: admin only
  if (body.is_pinned !== undefined && auth.isAdmin) {
    updateData.is_pinned = body.is_pinned;
  }

  const { data, error } = await supabase
    .from("forum_posts")
    .update(updateData)
    .eq("id", id)
    .select("*, author:profiles(id, nickname, avatar_url, role)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const auth = await getAuthContext(supabase);
  if (!auth) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const { data: post } = await supabase
    .from("forum_posts")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!post) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 });
  }

  if (post.author_id !== auth.user.id && !auth.isAdmin) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
  }

  const { error } = await supabase.from("forum_posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
