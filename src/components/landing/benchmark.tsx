"use client";

import { useLanguage } from "@/lib/i18n";

const benchmarkData = [
  { geul: "464 ms", c: "321 ms", cRatio: "1.45\u00d7", python: "7,364 ms", pyRatio: "15.9\u00d7" },
  { geul: "10 ms", c: "8 ms", cRatio: "1.30\u00d7", python: "167 ms", pyRatio: "16.7\u00d7" },
  { geul: "1,564 ms", c: "564 ms", cRatio: "2.77\u00d7", python: "38,377 ms", pyRatio: "24.5\u00d7" },
];

export default function Benchmark() {
  const { t } = useLanguage();

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-geul-text mb-2">
          {t.benchmark.title}
        </h2>
        <p className="text-geul-text-secondary mb-12 max-w-2xl">
          {t.benchmark.subtitle}
        </p>

        <p className="text-xs text-geul-text-muted mb-6">
          {t.benchmark.note}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-geul-border text-geul-text-secondary">
                <th className="py-3 pr-6 text-left font-medium">{t.benchmark.headers.benchmark}</th>
                <th className="py-3 px-4 text-right font-medium">{t.benchmark.headers.geul}</th>
                <th className="py-3 px-4 text-right font-medium">C (/O2)</th>
                <th className="py-3 px-4 text-right font-medium">{t.benchmark.headers.ratio}</th>
                <th className="py-3 px-4 text-right font-medium">Python</th>
                <th className="py-3 pl-4 text-right font-medium">{t.benchmark.headers.ratio}</th>
              </tr>
            </thead>
            <tbody>
              {t.benchmark.rows.map((row, i) => {
                const data = benchmarkData[i];
                return (
                  <tr
                    key={row.name}
                    className="border-b border-geul-border/50 hover:bg-geul-surface/50 transition-colors"
                  >
                    <td className="py-3 pr-6 text-geul-text">{row.name}</td>
                    <td className="py-3 px-4 text-right text-geul-primary font-bold font-mono">
                      {data.geul}
                    </td>
                    <td className="py-3 px-4 text-right text-geul-text font-mono">
                      {data.c}
                    </td>
                    <td className="py-3 px-4 text-right text-geul-text-muted font-mono">
                      {data.cRatio}
                    </td>
                    <td className="py-3 px-4 text-right text-geul-text font-mono">
                      {data.python}
                    </td>
                    <td className="py-3 pl-4 text-right text-geul-text-muted font-mono">
                      {data.pyRatio}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
