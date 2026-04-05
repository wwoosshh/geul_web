import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "글 프로그래밍 언어",
  description: "한글로 프로그래밍하는 독자적 프로그래밍 언어. 100% 한글 키워드, SOV 어순, 네이티브 컴파일.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-geul-bg text-geul-text antialiased flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
