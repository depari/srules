import Link from "next/link";
import { getAllRules, getFeaturedRules, getAllCategories } from "@/lib/rules";

export default function Home() {
  const featuredRules = getFeaturedRules().slice(0, 6);
  const categories = getAllCategories().slice(0, 8);
  const totalRules = getAllRules().length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 p-2">
                <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Smart Rules Archive
                </h1>
                <p className="text-sm text-slate-400">{totalRules}개의 규칙이 등록되어 있습니다</p>
              </div>
            </div>
            <nav className="flex gap-4">
              <Link href="/rules" className="text-slate-300 hover:text-white transition-colors">
                규칙 목록
              </Link>
              <Link href="/submit" className="text-slate-300 hover:text-white transition-colors">
                규칙 등록
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-5xl font-bold tracking-tight">
            개발자를 위한 규칙 아카이브
          </h2>
          <p className="mt-6 text-xl text-slate-400 max-w-3xl mx-auto">
            코딩 규칙, 베스트 프랙티스, AI 프롬프트 템플릿을 체계적으로 관리하고 공유하세요
          </p>

          {/* Search Bar */}
          <div className="mt-10 mx-auto max-w-2xl">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="규칙, 프레임워크, 언어로 검색하세요..."
                className="w-full rounded-full border border-slate-700 bg-slate-900/50 py-4 pl-12 pr-4 text-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase()}`}
                className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
              >
                {category.name} ({category.count})
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rules */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold">Featured 규칙</h3>
          <Link href="/rules" className="text-purple-400 hover:text-purple-300 transition-colors">
            모두 보기 →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredRules.map((rule) => (
            <Link
              key={rule.slug}
              href={`/rules/${rule.slug}`}
              className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
            >
              <div className="mb-4">
                <h4 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {rule.title}
                </h4>
                <p className="mt-2 text-sm text-slate-400 line-clamp-3">
                  {rule.excerpt}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {rule.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {rule.difficulty && (
                <div className="mt-4 text-xs text-slate-500">
                  난이도: {rule.difficulty}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold mb-8">카테고리</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.name.toLowerCase()}`}
              className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="text-2xl font-bold text-cyan-400">{category.count}</div>
              <div className="mt-2 text-lg font-semibold text-white">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-slate-400">
            <p>Made with ❤️ by developers, for developers</p>
            <p className="mt-2 text-sm">
              <Link href="https://github.com" className="hover:text-purple-400 transition-colors">
                GitHub
              </Link>
              {" · "}
              <Link href="/docs" className="hover:text-purple-400 transition-colors">
                문서
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

