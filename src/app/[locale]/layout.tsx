/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import "highlight.js/styles/github-dark.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import QueryProvider from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Rules Archive - 개발자를 위한 규칙 아카이브",
  description: "코딩 규칙, 베스트 프랙티스, AI 프롬프트 템플릿을 체계적으로 관리하고 공유하세요",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Set the locale for static generation
  setRequestLocale(locale);

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        {/*
         * FOUC(Flash of Unstyled Content) 방지 인라인 스크립트
         * - 페이지 로드 직후 localStorage에서 테마를 읽어 즉시 적용
         * - hydration 전에 실행되어 흰 화면 깜빡임 방지
         * - 저장된 테마 없으면 'dark' 기본값 적용
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('srules-theme') || 'dark';
                  if (theme !== 'dark' && theme !== 'light') theme = 'dark';
                  document.documentElement.className = theme;
                } catch(e) {
                  document.documentElement.className = 'dark';
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <Header />
            {children}
            <Footer />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
