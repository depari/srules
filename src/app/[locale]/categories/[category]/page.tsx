import { notFound } from "next/navigation";
import { getAllCategories, getRulesByCategory } from "@/lib/rules";
import { Link, routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import RuleCard from "@/components/rules/RuleCard";

interface PageProps {
    params: Promise<{
        locale: string;
        category: string;
    }>;
}

export async function generateStaticParams() {
    const allCategories = getAllCategories();
    return routing.locales.flatMap((locale) =>
        allCategories.map((cat) => ({
            locale,
            category: cat.name.toLowerCase(),
        }))
    );
}

export default async function CategoryPage({ params }: PageProps) {
    const { category, locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'home' });
    const ct = await getTranslations({ locale, namespace: 'common' });

    const allCategories = getAllCategories();

    const matchedCategory = allCategories.find(
        (cat) => cat.name.toLowerCase() === category.toLowerCase()
    );

    if (!matchedCategory) {
        notFound();
    }

    const rules = getRulesByCategory(matchedCategory.name);

    return (
        <div className="py-12">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                    <span className="text-slate-700">/</span>
                    <Link href="/rules" className="hover:text-white transition-colors">{ct('list')}</Link>
                    <span className="text-slate-700">/</span>
                    <span className="text-cyan-400 font-bold uppercase font-mono">{matchedCategory.name}</span>
                </nav>

                {/* Title */}
                <div className="mb-12">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-tighter font-mono">
                        {matchedCategory.name}
                    </h1>
                    <p className="mt-4 text-slate-400 font-medium flex items-center gap-2 font-noto">
                        <span className="h-1 w-8 bg-cyan-500/20 rounded-full"></span>
                        {rules.length}개의 정제된 규칙이 발견되었습니다
                    </p>
                </div>

                {/* Rules Grid */}
                {rules.length === 0 ? (
                    <div className="rounded-[32px] border border-dashed border-slate-800 bg-slate-900/20 p-20 text-center shadow-inner">
                        <div className="mx-auto h-20 w-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-8 shadow-inner">
                            <svg className="h-10 w-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <p className="text-xl font-bold text-slate-400 font-noto">이 카테고리에는 아직 규칙이 없습니다.</p>
                        <Link
                            href="/submit"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 font-bold text-white hover:bg-slate-700 transition-all shadow-lg font-noto uppercase tracking-widest text-xs"
                        >
                            첫 규칙을 등록해보세요 →
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {rules.map((rule) => (
                            <RuleCard
                                key={rule.slug}
                                slug={rule.slug}
                                title={rule.title}
                                excerpt={rule.excerpt || ''}
                                author={rule.author}
                                created={rule.created}
                                difficulty={rule.difficulty}
                                category={rule.category}
                                tags={rule.tags}
                                featured={rule.featured}
                            />
                        ))}
                    </div>
                )}

                {/* Other Categories */}
                <div className="mt-24">
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight font-noto">{t('categories.title')}</h2>
                        <div className="h-px flex-1 bg-slate-800"></div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {allCategories
                            .filter(cat => cat.name !== matchedCategory.name)
                            .slice(0, 8)
                            .map((cat) => (
                                <Link
                                    key={cat.name}
                                    href={`/categories/${cat.name.toLowerCase()}`}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8 hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-500/10"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="text-4xl font-black bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                            {cat.count}
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-800 text-slate-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors shadow-inner">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-lg font-black text-slate-300 group-hover:text-cyan-400 transition-colors uppercase tracking-widest font-mono">
                                        {cat.name}
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
