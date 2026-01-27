import Link from "next/link";
import { getRulesByCategory, getAllCategories, getAllRules } from "@/lib/rules";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        category: string;
    }>;
}

export async function generateStaticParams() {
    const categories = getAllCategories();
    return categories.map((category) => ({
        category: category.name.toLowerCase(),
    }));
}

export default async function CategoryPage({ params }: PageProps) {
    const { category } = await params;
    const categoryName = decodeURIComponent(category);

    // 대소문자 구분 없이 카테고리 찾기
    const allCategories = getAllCategories();
    const matchedCategory = allCategories.find(
        cat => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (!matchedCategory) {
        notFound();
    }

    const rules = getRulesByCategory(matchedCategory.name);

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

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
                    <Link href="/" className="hover:text-white">홈</Link>
                    <span>/</span>
                    <Link href="/rules" className="hover:text-white">규칙</Link>
                    <span>/</span>
                    <span className="text-white">{matchedCategory.name}</span>
                </nav>

                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {matchedCategory.name}
                    </h1>
                    <p className="mt-2 text-slate-400">
                        {rules.length}개의 규칙이 있습니다
                    </p>
                </div>

                {/* Rules Grid */}
                {rules.length === 0 ? (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center">
                        <p className="text-slate-400">이 카테고리에는 아직 규칙이 없습니다.</p>
                        <Link
                            href="/submit"
                            className="mt-4 inline-block text-purple-400 hover:text-purple-300"
                        >
                            첫 규칙을 등록해보세요 →
                        </Link>
                    </div>
                ) : (
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
                                    {rule.tags.slice(0, 5).map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {rule.tags.length > 5 && (
                                        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                                            +{rule.tags.length - 5}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Other Categories */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">다른 카테고리</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {allCategories
                            .filter(cat => cat.name !== matchedCategory.name)
                            .slice(0, 8)
                            .map((cat) => (
                                <Link
                                    key={cat.name}
                                    href={`/categories/${cat.name.toLowerCase()}`}
                                    className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
                                >
                                    <div className="text-2xl font-bold text-cyan-400">{cat.count}</div>
                                    <div className="mt-2 text-lg font-semibold text-white">{cat.name}</div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
