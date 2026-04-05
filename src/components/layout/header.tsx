"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoIcon, MenuIcon, CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/docs", label: "문서" },
  { href: "/playground", label: "플레이그라운드" },
  { href: "/forum", label: "포럼" },
  { href: "/download", label: "다운로드" },
  { href: "/changelog", label: "변경이력" },
];

const adminLinks = [
  { href: "/admin/docs", label: "문서 관리" },
  { href: "/admin/changelog", label: "이력 관리" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function loadUserAndRole(currentUser: User | null) {
      setUser(currentUser);
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();
      setIsAdmin(data?.role === "admin");
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      loadUserAndRole(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserAndRole(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    router.refresh();
  }

  const nickname =
    user?.user_metadata?.nickname ||
    user?.user_metadata?.user_name ||
    user?.email?.split("@")[0] ||
    "";

  return (
    <header className="sticky top-0 z-50 bg-geul-bg/80 backdrop-blur-sm border-b border-geul-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-geul-text hover:text-geul-primary transition-colors"
        >
          <LogoIcon size={24} className="text-geul-primary" />
          <span className="font-semibold text-lg">글</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-geul-primary"
                  : "text-geul-text-secondary hover:text-geul-text"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAdmin && (
            <>
              <span className="h-4 w-px bg-geul-border" aria-hidden />
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    pathname.startsWith(link.href)
                      ? "text-geul-primary"
                      : "text-geul-warning/80 hover:text-geul-warning"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-geul-text-secondary">
                {nickname}
                {isAdmin && (
                  <span className="ml-1.5 text-xs text-geul-warning">
                    관리자
                  </span>
                )}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button variant="secondary" size="sm">
                로그인
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-geul-text-secondary hover:text-geul-text transition-colors cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-geul-border bg-geul-bg/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm py-1 transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-geul-primary"
                    : "text-geul-text-secondary hover:text-geul-text"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <div className="border-t border-geul-border pt-3 mt-1 flex flex-col gap-3">
                <span className="text-xs text-geul-text-muted uppercase tracking-wider">
                  관리자
                </span>
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-sm py-1 transition-colors ${
                      pathname.startsWith(link.href)
                        ? "text-geul-primary"
                        : "text-geul-warning/80 hover:text-geul-warning"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            <div className="border-t border-geul-border pt-3 mt-1">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-geul-text-secondary">
                    {nickname}
                    {isAdmin && (
                      <span className="ml-1.5 text-xs text-geul-warning">
                        관리자
                      </span>
                    )}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-geul-text-secondary hover:text-geul-text transition-colors"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
