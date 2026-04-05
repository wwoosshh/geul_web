import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const postId = request.nextUrl.searchParams.get("post_id");

  if (!postId) {
    return NextResponse.json({ error: "post_id는 필수입니다" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("forum_comments")
    .select("*, author:profiles(id, nickname, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const body = await request.json();
  const { post_id, content } = body;

  if (!post_id || !content) {
    return NextResponse.json(
      { error: "post_id와 content는 필수입니다" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("forum_comments")
    .insert({
      post_id,
      author_id: user.id,
      content,
    })
    .select("*, author:profiles(id, nickname, avatar_url)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id는 필수입니다" }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  // Check ownership or admin
  const { data: comment } = await supabase
    .from("forum_comments")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!comment) {
    return NextResponse.json({ error: "댓글을 찾을 수 없습니다" }, { status: 404 });
  }

  if (comment.author_id !== user.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
    }
  }

  const { error } = await supabase.from("forum_comments").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
