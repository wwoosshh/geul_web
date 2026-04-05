"use client";

import { useEffect, useRef, useState } from "react";

export interface OutputLine {
  type: "stdout" | "stderr" | "system";
  text: string;
}

interface OutputPanelProps {
  output: OutputLine[];
  compileLog: string;
  onClear: () => void;
}

const TABS = [
  { id: "output" as const, label: "출력" },
  { id: "compile" as const, label: "컴파일 로그" },
];

export function OutputPanel({ output, compileLog, onClear }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<"output" | "compile">("output");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output, compileLog, activeTab]);

  return (
    <div className="flex h-full flex-col rounded-md border border-geul-border bg-geul-input">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-geul-border px-1">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "text-geul-primary border-b border-geul-primary"
                  : "text-geul-text-muted hover:text-geul-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={onClear}
          className="px-2 py-1 text-xs text-geul-text-muted hover:text-geul-text-secondary transition-colors cursor-pointer"
        >
          지우기
        </button>
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-3 font-mono text-sm leading-relaxed"
      >
        {activeTab === "output" ? (
          output.length === 0 ? (
            <p className="text-geul-text-muted">
              프로그램을 실행하면 출력이 여기에 표시됩니다.
            </p>
          ) : (
            output.map((line, i) => (
              <div
                key={i}
                className={
                  line.type === "stderr"
                    ? "text-geul-error"
                    : line.type === "system"
                      ? "text-geul-text-muted"
                      : "text-geul-text"
                }
              >
                {line.text}
              </div>
            ))
          )
        ) : compileLog ? (
          <pre className="whitespace-pre-wrap text-geul-text-secondary">
            {compileLog}
          </pre>
        ) : (
          <p className="text-geul-text-muted">
            컴파일 로그가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
