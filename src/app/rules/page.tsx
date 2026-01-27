import Link from "next/link";
import { getAllRules, getAllCategories, getAllTags } from "@/lib/rules";

export default function RulesPage() {
    const rules = getAllRules();
    const categories = getAllCategories();
    const tags = getAllTags();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 p-2">
                                <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Smart Rules Archive
                            </span>
                        </Link>
                        <nav className="flex gap-4">
                            <Link href="/rules" className="text-white font-semibold">
                                규칙 목록
                            </Link>
                            <Link href="/submit" className="text-slate-300 hover:text-white transition-colors">
                                규칙 등록
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-8 space-y-8">
                            {/* Search */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-3">검색</h3>
                                <input
                                    type="text"
                                    placeholder="규칙 검색..."
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            {/* Filters */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-3">필터</h3>
                                <div className="space-y-2">
                                    <Link href="/rules" className="block text-purple-400 text-sm py-1">
                                        전체 ({rules.length})
                                    </Link>
                                    <Link href="/rules?filter=featured" className="block text-slate-300 hover:text-white text-sm py-1">
                                        Featured
                                    </Link>
                                    <Link href="/rules?filter=recent" className="block text-slate-300 hover:text-white text-sm py-1">
                                        최신
                                    </Link>
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-3">카테고리</h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.name}
                                            href={`/categories/${category.name.toLowerCase()}`}
                                            className="flex justify-between text-sm py-1 text-slate-300 hover:text-white"
                                        >
                                            <span>{category.name}</span>
                                            <span className="text-slate-500">{category.count}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Tags */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-3">인기 태그</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tags.slice(0, 10).map((tag) => (
                                        <Link
                                            key={tag.name}
                                            href={`/tags/${tag.name.toLowerCase()}`}
                                            className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
                                        >
                                            {tag.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold">모든 규칙</h1>
                            <p className="mt-2 text-slate-400">
                                총 {rules.length}개의 규칙이 있습니다
                            </p>
                        </div>

                        {/* Rules Grid */}
                        <div className="grid gap-6">
                            {rules.map((rule) => (
                                <Link
                                    key={rule.slug}
                                    href={`/rules/${rule.slug}`}
                                    className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                                                {rule.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                                                {rule.excerpt}
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                                {rule.author && (
                                                    <span>작성자: {rule.author}</span>
                                                )}
                                                <span>{rule.created}</span>
                                                {rule.difficulty && (
                                                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">
                                                        {rule.difficulty}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {rule.featured && (
                                            <div className="ml-4">
                                                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
                                                    ⭐ Featured
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {rule.category.map((cat) => (
                                            <span
                                                key={cat}
                                                className="rounded-md bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-400"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                        {rule.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {rule.tags.length > 3 && (
                                            <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                                                +{rule.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
