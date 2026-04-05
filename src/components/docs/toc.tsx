"use client";

import { useState, useEffect, useRef } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocProps {
  content: string;
}

function parseHeadings(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~\[\]]/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s가-힣-]/g, "")
        .replace(/\s+/g, "-");
      items.push({ id, text, level });
    }
  }

  return items;
}

export function TableOfContents({ content }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const headings = parseHeadings(content);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const ids = headings.map((h) => h.id);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block sticky top-14 h-[calc(100vh-3.5rem)] w-48 shrink-0 overflow-y-auto py-6 pl-4">
      <p className="text-xs font-medium text-geul-text-muted uppercase tracking-wider mb-3">
        목차
      </p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "ml-3" : ""}>
            <a
              href={`#${h.id}`}
              className={`block text-xs py-0.5 transition-colors ${
                activeId === h.id
                  ? "text-geul-primary"
                  : "text-geul-text-muted hover:text-geul-text-secondary"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
