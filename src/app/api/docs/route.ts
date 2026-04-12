import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const category = request.nextUrl.searchParams.get("category");
  const all = request.nextUrl.searchParams.get("all");
  const lang = request.nextUrl.searchParams.get("lang");
  const table = lang === "en" ? "docs_en" : "docs";

  // If "all" param is set, verify admin — non-admins get 403
  let isAdmin = false;
  if (all) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      isAdmin = profile?.role === "admin";
    }
    if (!isAdmin) {
      return NextResponse.json({ error: "관리자 권한이 필요합니다" }, { status: 403 });
    }
  }

  const columns = isAdmin
    ? "*"
    : "id, slug, title, category, sort_order, is_published, created_at, updated_at";

  let query = supabase.from(table).select(columns).order("category").order("sort_order");

  if (!isAdmin) {
    query = query.eq("is_published", true);
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "관리자 권한이 필요합니다" }, { status: 403 });
  }

  const body = await request.json();
  const { title, slug, content, category, sort_order, is_published } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "제목과 슬러그는 필수입니다" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("docs")
    .insert({
      title,
      slug,
      content: content || "",
      category: category || "시작하기",
      sort_order: sort_order ?? 0,
      is_published: is_published ?? false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
