"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoIcon, MenuIcon, CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { lang, t, toggleLang } = useLanguage();

  const navLinks = [
    { href: "/docs", label: t.nav.docs },
    { href: "/playground", label: t.nav.playground },
    { href: "/forum", label: t.nav.forum },
    { href: "/download", label: t.nav.download },
    { href: "/changelog", label: t.nav.changelog },
  ];

  const adminLinks = [
    { href: "/admin/docs", label: t.nav.docManage },
    { href: "/admin/changelog", label: t.nav.changelogManage },
  ];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
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
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="text-xs font-medium px-2 py-1 rounded border border-geul-border text-geul-text-secondary hover:text-geul-text hover:border-geul-text-secondary transition-colors cursor-pointer"
            aria-label="Toggle language"
          >
            {lang === "ko" ? "EN" : "KO"}
          </button>

          {user ? (
            <>
              <span className="text-sm text-geul-text-secondary">
                {nickname}
                {isAdmin && (
                  <span className="ml-1.5 text-xs text-geul-warning">
                    {t.nav.admin}
                  </span>
                )}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t.nav.logout}
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button variant="secondary" size="sm">
                {t.nav.login}
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
                  {t.nav.admin}
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

            <div className="border-t border-geul-border pt-3 mt-1 flex flex-col gap-3">
              {/* Mobile Language Toggle */}
              <button
                onClick={() => { toggleLang(); setMenuOpen(false); }}
                className="text-sm py-1 text-geul-text-secondary hover:text-geul-text transition-colors text-left cursor-pointer"
              >
                {lang === "ko" ? "English" : "한국어"}
              </button>
            </div>

            <div className="border-t border-geul-border pt-3 mt-1">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-geul-text-secondary">
                    {nickname}
                    {isAdmin && (
                      <span className="ml-1.5 text-xs text-geul-warning">
                        {t.nav.admin}
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
                    {t.nav.logout}
                  </Button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-geul-text-secondary hover:text-geul-text transition-colors"
                >
                  {t.nav.login}
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
