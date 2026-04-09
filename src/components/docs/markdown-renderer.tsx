"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import { registerGeulLanguage } from "@/lib/geul-language";
import type { Components } from "react-markdown";

// Track registration so we only do it once
let registered = false;

function ensureGeulRegistered() {
  if (!registered) {
    registerGeulLanguage(hljs);
    registered = true;
  }
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// CommonMark 파서(micromark)는 닫는 **  뒤에 한글이 바로 오면
// right-flanking delimiter로 인식하지 못해 볼드가 깨진다.
// 닫는 ** 뒤에 한글/CJK가 오면 공백을 삽입하여 우회.
function fixCjkEmphasis(md: string): string {
  return md.replace(/(\*{1,2})(?=[가-힣ㄱ-ㅎㅏ-ㅣ一-龥])/g, (match, stars, offset) => {
    // 여는 ** 는 건드리지 않음 — 앞이 공백/줄시작/문장부호이면 여는 것
    const before = md[offset - 1];
    if (!before || /[\s\n(,.]/.test(before)) return match;
    return stars + " ";
  });
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGeulRegistered();
  }, []);

  const processed = fixCjkEmphasis(content);

  const components: Components = {
    // Code blocks and inline code
    pre({ children }) {
      return (
        <pre className="bg-geul-input rounded-lg overflow-x-auto p-4 my-4 font-mono text-sm leading-relaxed">
          {children}
        </pre>
      );
    },
    code({ className: codeClassName, children, ...props }) {
      const isInline = !codeClassName;
      if (isInline) {
        return (
          <code
            className="bg-geul-input px-1.5 py-0.5 rounded text-geul-primary font-mono text-sm"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code className={codeClassName} {...props}>
          {children}
        </code>
      );
    },

    // Headings
    h1({ children }) {
      return (
        <h1 className="text-geul-text text-3xl font-bold mt-8 mb-4 group">
          {children}
        </h1>
      );
    },
    h2({ children }) {
      return (
        <h2 className="text-geul-text text-2xl font-bold mt-8 mb-3 pb-2 border-b border-geul-border group">
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 className="text-geul-text text-xl font-semibold mt-6 mb-2 group">
          {children}
        </h3>
      );
    },
    h4({ children }) {
      return (
        <h4 className="text-geul-text text-lg font-semibold mt-4 mb-2 group">
          {children}
        </h4>
      );
    },

    // Links
    a({ href, children }) {
      return (
        <a
          href={href}
          className="text-geul-primary hover:underline"
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },

    // Blockquotes
    blockquote({ children }) {
      return (
        <blockquote className="border-l-2 border-geul-primary pl-4 my-4 text-geul-text-secondary italic">
          {children}
        </blockquote>
      );
    },

    // Tables
    table({ children }) {
      return (
        <div className="overflow-x-auto my-4">
          <table className="w-full border-collapse border border-geul-border text-sm">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="bg-geul-surface">{children}</thead>;
    },
    th({ children }) {
      return (
        <th className="border border-geul-border px-4 py-2 text-left font-semibold text-geul-text">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="border border-geul-border px-4 py-2 text-geul-text">
          {children}
        </td>
      );
    },

    // Lists
    ul({ children }) {
      return (
        <ul className="list-disc list-inside my-3 space-y-1 text-geul-text marker:text-geul-text-secondary">
          {children}
        </ul>
      );
    },
    ol({ children }) {
      return (
        <ol className="list-decimal list-inside my-3 space-y-1 text-geul-text marker:text-geul-text-secondary">
          {children}
        </ol>
      );
    },
    li({ children }) {
      return <li className="leading-relaxed">{children}</li>;
    },

    // Paragraphs
    p({ children }) {
      return <p className="my-3 text-geul-text leading-relaxed">{children}</p>;
    },

    // Horizontal rule
    hr() {
      return <hr className="my-6 border-geul-border" />;
    },

    // Images
    img({ src, alt }) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || ""}
          className="max-w-full rounded my-4"
        />
      );
    },

    // Strong / emphasis
    strong({ children }) {
      return <strong className="font-bold text-geul-text">{children}</strong>;
    },
    em({ children }) {
      return <em className="italic text-geul-text-secondary">{children}</em>;
    },
  };

  return (
    <div ref={containerRef} className={`markdown-body ${className || ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ]}
        components={components}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
