import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("changelog_entries")
    .select("*")
    .order("sort_order", { ascending: false });

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
  const { version, title, content, release_date } = body;

  if (!version || !title) {
    return NextResponse.json({ error: "버전과 제목은 필수입니다" }, { status: 400 });
  }

  // sort_order 자동 할당: 현재 최대값 + 1
  const { data: maxRow } = await supabase
    .from("changelog_entries")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const nextSortOrder = (maxRow?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("changelog_entries")
    .insert({
      version,
      title,
      content: content || "",
      release_date: release_date || new Date().toISOString().split("T")[0],
      sort_order: nextSortOrder,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
