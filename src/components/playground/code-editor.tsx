"use client";

import { useRef, useCallback } from "react";
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

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // Apply error markers if any
      if (errors.length > 0) {
        applyErrorMarkers(editor, monaco, errors);
      }
    },
    [errors]
  );

  const handleChange = useCallback(
    (val: string | undefined) => {
      onChange(val ?? "");
    },
    [onChange]
  );

  // Update markers when errors change
  if (editorRef.current && monacoRef.current) {
    applyErrorMarkers(editorRef.current, monacoRef.current, errors);
  }

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
  editor: editor.IStandaloneCodeEditor,
  monaco: Parameters<OnMount>[1],
  errors: EditorError[]
) {
  const model = editor.getModel();
  if (!model) return;

  const markers = errors.map((err) => ({
    severity: monaco.MarkerSeverity.Error,
    message: err.message,
    startLineNumber: err.line,
    startColumn: 1,
    endLineNumber: err.line,
    endColumn: model.getLineMaxColumn(err.line),
  }));

  monaco.editor.setModelMarkers(model, "geul", markers);
}
