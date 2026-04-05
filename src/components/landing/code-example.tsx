export default function CodeExample() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-geul-text mb-4">
          코드 예제
        </h2>
        <p className="text-geul-text-secondary mb-12 max-w-2xl">
          한글 키워드와 SOV 어순으로 자연스럽게 읽히는 코드
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
          {/* Code block */}
          <div className="rounded-md bg-geul-input overflow-hidden">
            <div className="px-4 py-2 text-xs text-geul-text-muted border-b border-geul-border">
              hello.글
            </div>
            <pre className="p-5 font-mono text-sm leading-7 overflow-x-auto">
              <code>
                <span className="text-geul-primary">포함</span>
                <span className="text-geul-text"> </span>
                <span className="text-[#f59e0b]">&quot;std.gl&quot;</span>
                {"\n\n"}
                <span className="text-blue-400">[시작하기]</span>
                <span className="text-geul-text">는 -&gt; </span>
                <span className="text-geul-primary">정수</span>
                <span className="text-geul-text"> {"{"}</span>
                {"\n"}
                <span className="text-geul-text">    </span>
                <span className="text-geul-primary">문자열</span>
                <span className="text-geul-text"> 이름 = </span>
                <span className="text-[#f59e0b]">&quot;세계&quot;</span>
                <span className="text-geul-text">.</span>
                {"\n"}
                <span className="text-geul-text">    </span>
                <span className="text-geul-primary">정수</span>
                <span className="text-geul-text"> 년도 = </span>
                <span className="text-geul-error">2026</span>
                <span className="text-geul-text">.</span>
                {"\n"}
                <span className="text-geul-text">    </span>
                <span className="text-[#f59e0b]">&quot;안녕, {"{"}이름{"}"} ! {"{"}년도{"}"}년입니다.\n&quot;</span>
                <span className="text-geul-text">을 </span>
                <span className="text-geul-text">쓰다</span>
                <span className="text-geul-text">.</span>
                {"\n"}
                <span className="text-geul-text">    </span>
                <span className="text-geul-primary">반환</span>
                <span className="text-geul-text"> </span>
                <span className="text-geul-error">0</span>
                <span className="text-geul-text">.</span>
                {"\n"}
                <span className="text-geul-text">{"}"}</span>
              </code>
            </pre>
          </div>

          {/* Output */}
          <div className="rounded-md bg-geul-bg border border-geul-border overflow-hidden lg:min-w-[280px]">
            <div className="px-4 py-2 text-xs text-geul-text-muted border-b border-geul-border">
              출력
            </div>
            <pre className="p-5 font-mono text-sm leading-7">
              <code>
                <span className="text-geul-text-muted">&gt; </span>
                <span className="text-geul-text">안녕, 세계! 2026년입니다.</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
