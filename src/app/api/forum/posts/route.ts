import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const offset = (page - 1) * limit;

  let query = supabase
    .from("forum_posts")
    .select("*, author:profiles(id, nickname, avatar_url, role)", { count: "exact" })
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return NextResponse.json({
    posts: data,
    totalPages,
    currentPage: page,
  });
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
  const { category, title, content } = body;

  if (!category || !title || !content) {
    return NextResponse.json(
      { error: "카테고리, 제목, 내용은 필수입니다" },
      { status: 400 }
    );
  }

  // "notice" category: admin only
  if (category === "notice") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "공지 작성은 관리자만 가능합니다" },
        { status: 403 }
      );
    }
  }

  const { data, error } = await supabase
    .from("forum_posts")
    .insert({
      author_id: user.id,
      category,
      title,
      content,
    })
    .select("*, author:profiles(id, nickname, avatar_url, role)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
