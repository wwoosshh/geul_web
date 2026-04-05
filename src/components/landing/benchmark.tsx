const benchmarks = [
  {
    name: "재귀 fib(40)",
    geul: "464 ms",
    c: "321 ms",
    cRatio: "1.45\u00d7",
    python: "7,364 ms",
    pyRatio: "15.9\u00d7",
  },
  {
    name: "소수 체 100만",
    geul: "10 ms",
    c: "8 ms",
    cRatio: "1.30\u00d7",
    python: "167 ms",
    pyRatio: "16.7\u00d7",
  },
  {
    name: "버블정렬 3만",
    geul: "1,564 ms",
    c: "564 ms",
    cRatio: "2.77\u00d7",
    python: "38,377 ms",
    pyRatio: "24.5\u00d7",
  },
];

export default function Benchmark() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-geul-text mb-2">
          성능
        </h2>
        <p className="text-geul-text-secondary mb-12 max-w-2xl">
          C(/O2) 대비 1.3~2.8x -- Python 대비 15~25x 빠름
        </p>

        <p className="text-xs text-geul-text-muted mb-6">
          C는 MSVC /O2 최적화 적용. Intel Ultra 5 226V, 5회 중앙값.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-geul-border text-geul-text-secondary">
                <th className="py-3 pr-6 text-left font-medium">벤치마크</th>
                <th className="py-3 px-4 text-right font-medium">글 네이티브</th>
                <th className="py-3 px-4 text-right font-medium">C (/O2)</th>
                <th className="py-3 px-4 text-right font-medium">배율</th>
                <th className="py-3 px-4 text-right font-medium">Python</th>
                <th className="py-3 pl-4 text-right font-medium">배율</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((row) => (
                <tr
                  key={row.name}
                  className="border-b border-geul-border/50 hover:bg-geul-surface/50 transition-colors"
                >
                  <td className="py-3 pr-6 text-geul-text">{row.name}</td>
                  <td className="py-3 px-4 text-right text-geul-primary font-bold font-mono">
                    {row.geul}
                  </td>
                  <td className="py-3 px-4 text-right text-geul-text font-mono">
                    {row.c}
                  </td>
                  <td className="py-3 px-4 text-right text-geul-text-muted font-mono">
                    {row.cRatio}
                  </td>
                  <td className="py-3 px-4 text-right text-geul-text font-mono">
                    {row.python}
                  </td>
                  <td className="py-3 pl-4 text-right text-geul-text-muted font-mono">
                    {row.pyRatio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
