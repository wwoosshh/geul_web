"use client";

import dynamic from "next/dynamic";

// Load the real MarkdownRenderer on the client only. Server-side rendering
// of react-markdown + rehype-highlight has been observed to crash on certain
// content/environments. Rendering client-only avoids the whole class of
// SSR failures while keeping the component visible as soon as JS loads.
export const MarkdownRenderer = dynamic(
  () =>
    import("@/components/docs/markdown-renderer").then((m) => ({
      default: m.MarkdownRenderer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="text-geul-text-muted text-sm py-4">
        콘텐츠 불러오는 중...
      </div>
    ),
  }
);
