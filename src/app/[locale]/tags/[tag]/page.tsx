import { getAllRules, getAllTags } from "@/lib/rules";
import RuleCard from "@/components/rules/RuleCard";
import SearchBar from "@/components/common/SearchBar";
import { Link, routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        locale: string;
        tag: string;
    }>;
}

// 태그 이름을 URL-safe slug로 변환
function tagToSlug(tagName: string): string {
    return tagName.toLowerCase().replace(/\s+/g, '-');
}

// slug를 원래 태그 이름으로 변환
function slugToTag(slug: string, allTags: ReturnType<typeof getAllTags>): string | null {
    const tag = allTags.find(t => tagToSlug(t.name) === slug);
    return tag ? tag.name : null;
}

export function generateStaticParams() {
    const tags = getAllTags();
    const params: { locale: string; tag: string }[] = [];

    routing.locales.forEach((locale) => {
        tags.forEach((tag) => {
            params.push({
                locale,
                tag: tagToSlug(tag.name),
            });
        });
    });

    return params;
}

export default async function TagPage({ params }: PageProps) {
    const { locale, tag: tagSlug } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'home' });
    const ct = await getTranslations({ locale, namespace: 'common' });

    const allRules = getAllRules();
    const allTags = getAllTags();

    // slug를 원래 태그 이름으로 변환
    const tagName = slugToTag(tagSlug, allTags);

    if (!tagName) {
        notFound();
    }

    // 현재 태그로 필터링
    const rules = allRules.filter((rule) =>
        rule.tags.some((t) => t.toLowerCase() === tagName.toLowerCase())
    );

    // 태그 정보 찾기
    const tagInfo = allTags.find((t) => t.name.toLowerCase() === tagName.toLowerCase());

    if (!tagInfo) {
        notFound();
    }

    return (
        <div className="py-12">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Link
                            href="/rules"
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            ← {ct('list')}
                        </Link>
                        <span className="text-slate-700">/</span>
                        <span className="text-sm text-slate-500">태그</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl font-noto">
                                        #{tagInfo.name}
                                    </h1>
                                    <p className="mt-2 text-lg text-slate-400 font-medium font-noto">
                                        {rules.length}개의 규칙
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-96 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 focus-within:border-purple-500/50 shadow-xl transition-all">
                            <SearchBar variant="compact" placeholder={ct('search')} />
                        </div>
                    </div>
                </div>

                {/* Rules Grid */}
                {rules.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                ) : (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
                            <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-lg text-slate-400">이 태그에 해당하는 규칙이 없습니다.</p>
                    </div>
                )}

                {/* Related Tags */}
                {allTags.length > 1 && (
                    <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
                        <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <span className="h-1 w-4 bg-purple-500 rounded-full"></span>
                            다른 태그
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {allTags
                                .filter((t) => tagToSlug(t.name) !== tagSlug)
                                .map((t) => (
                                    <Link
                                        key={t.name}
                                        href={`/tags/${tagToSlug(t.name)}`}
                                        className="inline-flex items-center rounded-lg bg-slate-800/50 border border-slate-800 px-3 py-1.5 text-xs font-bold text-slate-400 hover:border-purple-500/50 hover:text-purple-400 transition-all cursor-pointer"
                                    >
                                        #{t.name}
                                        <span className="ml-1.5 opacity-40 text-[10px]">{t.count}</span>
                                    </Link>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
