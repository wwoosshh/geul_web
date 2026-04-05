import type { HLJSApi, Language } from "highlight.js";

export function registerGeulLanguage(hljs: HLJSApi) {
  const lang: Language = {
    name: "글",
    aliases: ["geul", "글"],
    keywords: {
      keyword:
        "포함 반환 반복 반복하기 동안 이면 아니면 갈래 경우 기본 탈출 계속 정의 만약정의 끝 정적 외부 상수",
      type: "정수 실수 문자열 문자 참거짓 긴정수 짧은정수 작은정수 짧은실수 공허 묶음 나열 합침 별칭",
      literal: "참 거짓",
      built_in: "쓰다 쓰기 증가하다 감소하다 할당하다 해제하다 크기",
    },
    contains: [
      // Comment: (* ... *) — supports nesting
      hljs.COMMENT("\\(\\*", "\\*\\)", { contains: ["self"] }),
      // String with interpolation
      {
        scope: "string",
        begin: '"',
        end: '"',
        contains: [
          { scope: "subst", begin: "\\{", end: "\\}" },
          hljs.BACKSLASH_ESCAPE,
        ],
      },
      // Character literal
      { scope: "string", begin: "'", end: "'" },
      // Entry point and function definitions [...]
      {
        scope: "title.function",
        begin: "\\[",
        end: "\\]",
      },
      // Numbers
      hljs.NUMBER_MODE,
      // Particles/postpositions (조사)
      {
        scope: "keyword",
        match: "(을|를|에|로|으로|의|와|에서|보다|는|은)",
      },
      // Statement terminator
      {
        scope: "punctuation",
        match: "\\.",
      },
    ],
  };

  hljs.registerLanguage("geul", () => lang);
  hljs.registerLanguage("글", () => lang);
}

// Monaco Editor token definitions for Task 11
export const geulMonarchLanguage = {
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
  builtins: ["쓰다", "쓰기", "증가하다", "감소하다", "할당하다", "해제하다", "크기"],
  particles: ["을", "를", "에", "로", "으로", "의", "와", "에서", "보다", "는", "은"],
};
