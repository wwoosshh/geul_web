import {
  DocumentIcon,
  TerminalIcon,
  LinkIcon,
  ChevronRightIcon,
  PlayIcon,
  CheckIcon,
} from "@/components/icons";

const features = [
  {
    icon: DocumentIcon,
    title: "100% 한글 키워드",
    description: "영어 함수명이 사용자 코드에 노출되지 않음",
  },
  {
    icon: TerminalIcon,
    title: "SOV 어순",
    description: '한국어 문법처럼 "대상을 함수하다"',
  },
  {
    icon: LinkIcon,
    title: "조사 바인딩",
    description: '"을/를", "에", "로" 등 조사가 인자 역할 결정',
  },
  {
    icon: ChevronRightIcon,
    title: "문자열 보간",
    description: '"{이름}은 {나이}세" 변수 직접 삽입',
  },
  {
    icon: PlayIcon,
    title: "네이티브 컴파일",
    description: "C 컴파일러 없이 .글 → .exe 직접 컴파일",
  },
  {
    icon: CheckIcon,
    title: "자체호스팅",
    description: "글 컴파일러가 자기 자신을 컴파일",
  },
];

export default function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-geul-text mb-4">
          특징
        </h2>
        <p className="text-geul-text-secondary mb-16 max-w-2xl">
          한국어의 문법 구조를 프로그래밍 언어에 자연스럽게 녹여냈습니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12">
          {features.map((feature) => (
            <div key={feature.title}>
              <feature.icon className="text-geul-primary mb-3" size={20} />
              <h3 className="text-base font-semibold text-geul-text mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-geul-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
