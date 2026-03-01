import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  keywords: ["개인 블로그", "개발 블로그", "Next.js", "MDX", "Vercel"],
  authors: [{ name: siteConfig.author }],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    type: "website",
    locale: "ko_KR"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="ko">
      <body>
        <ThemeProvider>
          <header className="site-header">
            <div className="site-header-inner">
              <Link className="brand" href="/">
                뜬눈으로 꾸는 꿈
              </Link>
              <nav className="nav">
                <Link href="/">글</Link>
                <Link href="/search">검색</Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
