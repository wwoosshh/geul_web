"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronRightIcon, MenuIcon, CloseIcon } from "@/components/icons";
import { useLanguage } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

interface Doc {
  id: string;
  slug: string;
  title: string;
  category: string;
  sort_order: number;
}

interface SidebarProps {
  currentSlug?: string;
  initialDocs?: Doc[];
  lang?: Language;
}

export function Sidebar({ currentSlug, initialDocs, lang: serverLang }: SidebarProps) {
  const { t, lang: clientLang } = useLanguage();
  const lang = serverLang ?? clientLang;
  const CATEGORIES = t.docs.categories;

  const [docs, setDocs] = useState<Doc[]>(initialDocs ?? []);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (initialDocs) return;
    fetch("/api/docs")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDocs(data);
      })
      .catch(() => {});
  }, [initialDocs]);

  const grouped = CATEGORIES.reduce<Record<string, Doc[]>>((acc, cat) => {
    acc[cat] = docs.filter((d) => d.category === cat);
    return acc;
  }, {});

  function toggleCategory(cat: string) {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  const nav = (
    <nav className="space-y-1">
      {CATEGORIES.map((cat) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        const isCollapsed = collapsed[cat];

        return (
          <div key={cat}>
            <button
              onClick={() => toggleCategory(cat)}
              className="flex items-center gap-1 w-full px-2 py-1.5 text-sm font-medium text-geul-text-secondary hover:text-geul-text transition-colors cursor-pointer"
            >
              {isCollapsed ? (
                <ChevronRightIcon size={14} />
              ) : (
                <ChevronDownIcon size={14} />
              )}
              {cat}
            </button>
            {!isCollapsed && (
              <ul className="ml-4 space-y-0.5">
                {items.map((doc) => (
                  <li key={doc.id}>
                    <Link
                      href={`/docs/${doc.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-2 py-1 text-sm rounded transition-colors ${
                        currentSlug === doc.slug
                          ? "text-geul-primary bg-geul-primary/5"
                          : "text-geul-text-secondary hover:text-geul-text"
                      }`}
                    >
                      {doc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-40 bg-geul-surface border border-geul-border rounded-lg p-2.5 text-geul-text-secondary hover:text-geul-text transition-colors cursor-pointer"
        aria-label={mobileOpen ? t.docs.sidebarClose : t.docs.sidebarOpen}
      >
        {mobileOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen
            ? "fixed inset-y-0 left-0 z-30 w-64 bg-geul-bg border-r border-geul-border pt-16 px-3 pb-4 overflow-y-auto"
            : "hidden lg:block"
        } lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:w-56 lg:shrink-0 lg:overflow-y-auto lg:py-6 lg:pr-4`}
      >
        {nav}
      </aside>
    </>
  );
}
