import { getAllRules, getAllCategories, getAllTags } from "@/lib/rules";
import RuleCard from "@/components/rules/RuleCard";
import SearchBar from "@/components/common/SearchBar";
import { Link, routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface PageProps {
    params: Promise<{
        locale: string;
    }>;
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function RulesPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'home' });
    const ct = await getTranslations({ locale, namespace: 'common' });

    const rules = getAllRules();
    const categories = getAllCategories();
    const tags = getAllTags();

    return (
        <div className="py-12">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl font-noto">{ct('list')}</h1>
                        <p className="mt-4 text-lg text-slate-400 font-medium font-noto">
                            {rules.length}개의 정제된 규칙들이 당신을 기다리고 있습니다.
                        </p>
                    </div>
                    <div className="w-full md:w-96 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 focus-within:border-purple-500/50 shadow-xl transition-all">
                        <SearchBar variant="compact" placeholder={ct('search')} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                    {/* Sidebar / Filters */}
                    <aside className="lg:col-span-1 space-y-10">
                        {/* Categories */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
                            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <span className="h-1 w-4 bg-cyan-500 rounded-full"></span>
                                {t('categories.title')}
                            </h3>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.name}
                                        href={`/categories/${cat.name.toLowerCase()}`}
                                        className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all group"
                                    >
                                        <span className="uppercase tracking-wide font-mono">{cat.name}</span>
                                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                                            {cat.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Popular Tags */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
                            <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <span className="h-1 w-4 bg-purple-500 rounded-full"></span>
                                인기 태그
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag.name}
                                        className="inline-flex items-center rounded-lg bg-slate-800/50 border border-slate-800 px-3 py-1.5 text-xs font-bold text-slate-400 hover:border-purple-500/50 hover:text-purple-400 transition-all cursor-default"
                                    >
                                        #{tag.name}
                                        <span className="ml-1.5 opacity-40 text-[10px]">{tag.count}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Rules List */}
                    <main className="lg:col-span-3">
                        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
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
