"use client";

import { useRef, useCallback, useEffect } from "react";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { geulLanguageDef, geulTheme } from "@/lib/geul-monarch";
import type { editor } from "monaco-editor";

interface EditorError {
  line: number;
  message: string;
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  errors?: EditorError[];
}

export function CodeEditor({ value, onChange, errors = [] }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);

  const handleBeforeMount: BeforeMount = useCallback((monaco) => {
    monaco.languages.register({ id: "geul" });
    monaco.languages.setMonarchTokensProvider("geul", geulLanguageDef);
    monaco.editor.defineTheme("geul-dark", geulTheme);
  }, []);

  const handleMount: OnMount = useCallback((editorInstance, monaco) => {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;
  }, []);

  const handleChange = useCallback(
    (val: string | undefined) => {
      onChange(val ?? "");
    },
    [onChange]
  );

  // Apply markers reactively when errors change — inside useEffect to avoid
  // running Monaco mutations during render.
  useEffect(() => {
    const editorInstance = editorRef.current;
    const monaco = monacoRef.current;
    if (!editorInstance || !monaco) return;
    applyErrorMarkers(editorInstance, monaco, errors);
  }, [errors]);

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-geul-border">
      <Editor
        height="100%"
        language="geul"
        theme="geul-dark"
        value={value}
        onChange={handleChange}
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        loading={
          <div className="flex h-full items-center justify-center bg-geul-input text-geul-text-muted text-sm">
            편집기 로딩 중...
          </div>
        }
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          renderLineHighlight: "line",
          tabSize: 4,
          insertSpaces: true,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          wordWrap: "off",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          contextmenu: false,
          overviewRulerBorder: false,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}

function applyErrorMarkers(
  editorInstance: editor.IStandaloneCodeEditor,
  monaco: Parameters<OnMount>[1],
  errors: EditorError[]
) {
  const model = editorInstance.getModel();
  if (!model) return;

  const lineCount = model.getLineCount();

  // Clamp line numbers into the valid [1, lineCount] range and drop
  // entries whose line is clearly invalid. Monaco throws
  // "Illegal value for lineNumber" for out-of-range values.
  const markers = errors
    .map((err) => {
      if (!Number.isFinite(err.line)) return null;
      let line = Math.floor(err.line);
      if (line < 1) line = 1;
      if (line > lineCount) line = lineCount;
      if (line < 1 || line > lineCount) return null;

      let endColumn = 1;
      try {
        endColumn = model.getLineMaxColumn(line);
      } catch {
        endColumn = 1;
      }

      return {
        severity: monaco.MarkerSeverity.Error,
        message: err.message,
        startLineNumber: line,
        startColumn: 1,
        endLineNumber: line,
        endColumn,
      };
    })
    .filter((m): m is NonNullable<typeof m> => m !== null);

  monaco.editor.setModelMarkers(model, "geul", markers);
}
