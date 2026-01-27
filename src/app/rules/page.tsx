import Link from "next/link";
import { getAllRules, getAllCategories, getAllTags } from "@/lib/rules";
import SearchBar from "@/components/common/SearchBar";
import RuleCard from "@/components/rules/RuleCard";

export default function RulesPage() {
    const rules = getAllRules();
    const categories = getAllCategories();
    const tags = getAllTags();

    return (
        <div className="py-8">

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-8 space-y-8">
                            {/* Search */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-3">검색</h3>
                                <SearchBar variant="compact" />
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
                                <RuleCard
                                    key={rule.slug}
                                    slug={rule.slug}
                                    title={rule.title}
                                    excerpt={rule.excerpt}
                                    author={rule.author}
                                    created={rule.created}
                                    difficulty={rule.difficulty}
                                    category={rule.category}
                                    tags={rule.tags}
                                    featured={rule.featured}
                                />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
