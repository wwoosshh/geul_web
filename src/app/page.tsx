import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import CodeExample from "@/components/landing/code-example";
import Benchmark from "@/components/landing/benchmark";
import CTA from "@/components/landing/cta";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <CodeExample />
      <Benchmark />
      <CTA />
    </div>
  );
}
