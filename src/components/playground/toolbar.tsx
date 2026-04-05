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
  "안녕세계": `포함 "std.gl"

[시작하기]는 {
"안녕 세계\\n"을 쓰다.
}
`,

  "피보나치": `포함 "std.gl"

[정수 수를 피보나치]는 -> 정수 {
    수 <= 1이면 { 수를 반환하다. }
    정수 앞은 (수 - 1)을 피보나치하다.
    정수 뒤는 (수 - 2)를 피보나치하다.
    앞 + 뒤를 반환하다.
}

[시작하기]는 -> 정수 {
    "=== 피보나치 수열 ===\\n"을 쓰다.

    정수 번호 = 0.
    (번호 < 15)동안 {
        정수 값은 번호를 피보나치하다.
        "피보나치(%d) = %d\\n"을 번호를 값을 쓰다.
        번호를 증가하다.
    }
    반환 0.
}
`,

  "구구단": `포함 "std.gl"

[시작하기]는 -> 정수 {
    "=== 구구단 ===\\n\\n"을 쓰다.

    정수 단 = 2.
    (단 <= 9)동안 {
        "[ %d단 ]\\n"을 단을 쓰다.
        정수 곱 = 1.
        (곱 <= 9)동안 {
            정수 결과는 단 * 곱.
            "%d x %d = %d\\n"을 단을 곱을 결과를 쓰다.
            곱을 증가하다.
        }
        "\\n"을 쓰다.
        단을 증가하다.
    }
    반환 0.
}
`,

  "버블정렬": `포함 "std.gl"

[시작하기]는 -> 정수 {
    "=== 버블정렬 ===\\n"을 쓰다.

    정수[10] 배열.
    배열[0] = 64. 배열[1] = 34. 배열[2] = 25.
    배열[3] = 12. 배열[4] = 22. 배열[5] = 11.
    배열[6] = 90. 배열[7] = 1.  배열[8] = 45.
    배열[9] = 78.

    "정렬 전: "을 쓰다.
    정수 번호 = 0.
    (번호 < 10)동안 {
        "%d "를 배열[번호]를 쓰다.
        번호를 증가하다.
    }
    "\\n"을 쓰다.

    정수 바깥 = 0.
    (바깥 < 9)동안 {
        정수 안쪽 = 0.
        (안쪽 < 9)동안 {
            배열[안쪽] > 배열[안쪽 + 1]이면 {
                정수 임시는 배열[안쪽].
                배열[안쪽] = 배열[안쪽 + 1].
                배열[안쪽 + 1] = 임시.
            }
            안쪽을 증가하다.
        }
        바깥을 증가하다.
    }

    "정렬 후: "을 쓰다.
    번호 = 0.
    (번호 < 10)동안 {
        "%d "를 배열[번호]를 쓰다.
        번호를 증가하다.
    }
    "\\n"을 쓰다.
    반환 0.
}
`,

  "문자열보간": `포함 "std.gl"

[시작하기]는 -> 정수 {
    문자열 이름 = "철수".
    정수 나이 = 25.

    "=== 문자열 보간 테스트 ===\\n"을 쓰다.

    "이름: {이름}, 나이: {나이}세\\n"을 쓰다.

    정수 점수 = 95.
    "{이름}의 점수는 {점수}점입니다\\n"을 쓰다.

    반환 0.
}
`,
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
