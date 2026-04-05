"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon, StopIcon } from "@/components/icons";

interface ToolbarProps {
  onBuildRun: () => void;
  onStop: () => void;
  onExampleSelect: (code: string) => void;
  isCompiling: boolean;
  isRunning: boolean;
  connected: boolean;
}

export const EXAMPLES: Record<string, string> = {
  "안녕세계": `포함 "std.gl"\n\n[시작하기]는 -> 정수 {\n    "안녕, 세계!\\n"을 쓰다.\n    반환 0.\n}`,
  "피보나치": `포함 "std.gl"\n\n[정수 수를 피보나치]는 -> 정수 {\n    수 <= 1이면 { 수를 반환하다. }\n    정수 앞은 (수 - 1)을 피보나치하다.\n    정수 뒤는 (수 - 2)를 피보나치하다.\n    앞 + 뒤를 반환하다.\n}\n\n[시작하기]는 -> 정수 {\n    정수 결과는 10을 피보나치하다.\n    "피보나치(10) = %d\\n"을 결과를 쓰다.\n    반환 0.\n}`,
  "구구단": `포함 "std.gl"\n\n[시작하기]는 -> 정수 {\n    정수 단 = 2.\n    (단 <= 9)동안 {\n        정수 곱 = 1.\n        (곱 <= 9)동안 {\n            정수 결과는 단 * 곱.\n            "%d x %d = %d\\n"을 단을 곱을 결과를 쓰다.\n            곱을 증가하다.\n        }\n        "\\n"을 쓰다.\n        단을 증가하다.\n    }\n    반환 0.\n}`,
  "버블정렬": `포함 "std.gl"\n\n[정수 나열 배열과 정수 길이를 버블정렬]은 -> 공허 {\n    정수 나는 0.\n    (나 < 길이 - 1)동안 {\n        정수 자는 0.\n        (자 < 길이 - 나 - 1)동안 {\n            배열[자] > 배열[자 + 1]이면 {\n                정수 임시는 배열[자].\n                배열[자] = 배열[자 + 1].\n                배열[자 + 1] = 임시.\n            }\n            자를 증가하다.\n        }\n        나를 증가하다.\n    }\n}\n\n[시작하기]는 -> 정수 {\n    정수 나열 숫자들 = {5, 3, 8, 1, 9, 2, 7}.\n    숫자들과 7을 버블정렬하다.\n    반환 0.\n}`,
  "문자열보간": `포함 "std.gl"\n\n[시작하기]는 -> 정수 {\n    문자열 이름은 "세계".\n    정수 나이는 1.\n    "안녕, {이름}! 글 언어는 {나이}살입니다.\\n"을 쓰다.\n    반환 0.\n}`,
};

export function Toolbar({
  onBuildRun,
  onStop,
  onExampleSelect,
  isCompiling,
  isRunning,
  connected,
}: ToolbarProps) {
  const busy = isCompiling || isRunning;

  return (
    <div className="flex items-center gap-3 rounded-md border border-geul-border bg-geul-surface px-4 py-2">
      <Button
        onClick={onBuildRun}
        disabled={busy || !connected}
        loading={isCompiling}
        size="sm"
        className="gap-1.5"
      >
        <PlayIcon size={14} />
        빌드 &amp; 실행
      </Button>

      {isRunning && (
        <Button onClick={onStop} variant="danger" size="sm" className="gap-1.5">
          <StopIcon size={14} />
          중지
        </Button>
      )}

      <div className="mx-2 h-5 w-px bg-geul-border" />

      <div className="flex items-center gap-2">
        <label className="text-xs text-geul-text-muted whitespace-nowrap">
          예제:
        </label>
        <select
          onChange={(e) => {
            const code = EXAMPLES[e.target.value];
            if (code) onExampleSelect(code);
          }}
          defaultValue=""
          className="appearance-none bg-geul-input border border-geul-border rounded px-2 py-1 text-xs text-geul-text outline-none focus:border-geul-primary transition-colors cursor-pointer"
        >
          <option value="" disabled>
            예제 선택
          </option>
          {Object.keys(EXAMPLES).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
