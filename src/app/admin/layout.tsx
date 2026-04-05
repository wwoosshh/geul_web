import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <aside className="hidden md:block w-48 shrink-0">
        <nav className="sticky top-20 space-y-1">
          <p className="text-xs font-medium text-geul-text-muted uppercase tracking-wider mb-3">
            관리
          </p>
          <Link
            href="/admin/docs"
            className="block px-3 py-1.5 text-sm text-geul-text-secondary hover:text-geul-text rounded transition-colors"
          >
            문서 관리
          </Link>
          <Link
            href="/admin/changelog"
            className="block px-3 py-1.5 text-sm text-geul-text-secondary hover:text-geul-text rounded transition-colors"
          >
            버전 이력 관리
          </Link>
        </nav>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
