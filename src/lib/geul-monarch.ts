import type { languages } from "monaco-editor";

export const geulLanguageDef: languages.IMonarchLanguage = {
  keywords: [
    "포함",
    "반환",
    "반복",
    "반복하기",
    "동안",
    "이면",
    "아니면",
    "갈래",
    "경우",
    "기본",
    "탈출",
    "계속",
    "정의",
    "만약정의",
    "끝",
    "정적",
    "외부",
    "상수",
  ],
  typeKeywords: [
    "정수",
    "실수",
    "문자열",
    "문자",
    "참거짓",
    "긴정수",
    "짧은정수",
    "작은정수",
    "짧은실수",
    "공허",
    "묶음",
    "나열",
    "합침",
    "별칭",
  ],
  literals: ["참", "거짓"],
  builtins: [
    "쓰다",
    "쓰기",
    "증가하다",
    "감소하다",
    "할당하다",
    "해제하다",
    "크기",
  ],
  particles: [
    "을",
    "를",
    "에",
    "로",
    "으로",
    "의",
    "와",
    "에서",
    "보다",
    "는",
    "은",
  ],

  tokenizer: {
    root: [
      // Comments (* ... *)
      [/\(\*/, "comment", "@comment"],

      // Function definitions [...]
      [/\[/, "delimiter.function", "@functionDef"],

      // Strings with interpolation
      [/"/, "string", "@string"],

      // Character literals
      [/'[^']*'/, "string.char"],

      // Numbers
      [/\d+\.\d+/, "number.float"],
      [/\d+/, "number"],

      // Arrow
      [/->/, "delimiter"],

      // Identifiers and keywords
      [
        /[가-힣a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@typeKeywords": "type",
            "@literals": "literal",
            "@builtins": "builtin",
            "@particles": "keyword.particle",
            "@default": "identifier",
          },
        },
      ],

      // Statement terminator
      [/\./, "delimiter.period"],

      // Braces, brackets, parens
      [/[{}()]/, "delimiter.bracket"],

      // Operators
      [/[+\-*/%=<>!&|^~]+/, "operator"],

      // Comma
      [/,/, "delimiter"],

      // Whitespace
      [/\s+/, "white"],
    ],

    comment: [
      [/\(\*/, "comment", "@push"],
      [/\*\)/, "comment", "@pop"],
      [/./, "comment"],
    ],

    functionDef: [
      [/\]/, "delimiter.function", "@pop"],
      [
        /[가-힣a-zA-Z_]\w*/,
        {
          cases: {
            "@typeKeywords": "type",
            "@default": "function",
          },
        },
      ],
      [/\s+/, "white"],
      [/./, "function"],
    ],

    string: [
      [/\\[nrt\\"']/, "string.escape"],
      [/\{/, "delimiter.interpolation", "@interpolation"],
      [/"/, "string", "@pop"],
      [/./, "string"],
    ],

    interpolation: [
      [/\}/, "delimiter.interpolation", "@pop"],
      [
        /[가-힣a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "variable.interpolation",
          },
        },
      ],
      [/./, "variable.interpolation"],
    ],
  },
};

export const geulTheme = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "keyword", foreground: "10b981" },
    { token: "keyword.particle", foreground: "10b981", fontStyle: "italic" },
    { token: "type", foreground: "3b82f6" },
    { token: "string", foreground: "f59e0b" },
    { token: "string.char", foreground: "f59e0b" },
    { token: "string.escape", foreground: "d97706" },
    { token: "comment", foreground: "555555", fontStyle: "italic" },
    { token: "number", foreground: "ef4444" },
    { token: "number.float", foreground: "ef4444" },
    { token: "function", foreground: "60a5fa" },
    { token: "literal", foreground: "f59e0b" },
    { token: "builtin", foreground: "10b981", fontStyle: "italic" },
    { token: "delimiter.interpolation", foreground: "10b981" },
    { token: "variable.interpolation", foreground: "e5e5e5" },
    { token: "delimiter.function", foreground: "60a5fa" },
    { token: "delimiter.period", foreground: "888888" },
    { token: "operator", foreground: "888888" },
    { token: "identifier", foreground: "e5e5e5" },
  ],
  colors: {
    "editor.background": "#1a1a1a",
    "editor.foreground": "#e5e5e5",
    "editor.lineHighlightBackground": "#222222",
    "editorCursor.foreground": "#10b981",
    "editor.selectionBackground": "#10b98133",
    "editorLineNumber.foreground": "#555555",
    "editorLineNumber.activeForeground": "#888888",
    "editorWidget.background": "#111111",
    "editorWidget.border": "#222222",
    "editorSuggestWidget.background": "#111111",
    "editorSuggestWidget.border": "#222222",
  },
};
