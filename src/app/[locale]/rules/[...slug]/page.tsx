import { notFound } from "next/navigation";
import { getRuleBySlug, markdownToHtml, getAllRules } from "@/lib/rules";
import RuleActions from "@/components/rules/RuleActions";
import VersionHistory from "@/components/rules/VersionHistory";
import ReadingProgress from "@/components/rules/ReadingProgress";
import { Link, routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface PageProps {
    params: Promise<{
        locale: string;
        slug: string[];
    }>;
}

export async function generateStaticParams() {
    const rules = getAllRules();
    return routing.locales.flatMap((locale) =>
        rules.map((rule) => ({
            locale,
            slug: rule.slug.split('/'),
        }))
    );
}

export default async function RulePage({ params }: PageProps) {
    const { slug, locale } = await params;
    setRequestLocale(locale);
    const ct = await getTranslations({ locale, namespace: 'common' });

    // slug 배열을 경로로 합치기
    const slugPath = slug.join('/');
    const rule = getRuleBySlug(slugPath);

    if (!rule) {
        notFound();
    }

    const htmlContent = await markdownToHtml(rule.content);

    return (
        <div className="py-8">
            <ReadingProgress />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                    <span className="text-slate-700">/</span>
                    <Link href="/rules" className="hover:text-white transition-colors">{ct('list')}</Link>
                    <span className="text-slate-700">/</span>
                    <span className="text-white line-clamp-1">{rule.title}</span>
                </nav>

                {/* Title and Meta */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight tracking-tighter">{rule.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-medium">
                        {rule.author && (
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-300 shadow-inner">
                                    {rule.author.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-bold">{rule.author}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                            </svg>
                            <span>{rule.created}</span>
                        </div>
                        {rule.difficulty && (
                            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-[10px] font-black text-purple-400 border border-purple-500/20 uppercase tracking-[0.2em]">
                                {rule.difficulty}
                            </span>
                        )}
                    </div>
                </div>

                {/* Categories & Tags */}
                <div className="mb-10 flex flex-wrap gap-2">
                    {rule.category.map((cat) => (
                        <Link
                            key={cat}
                            href={`/categories/${cat.toLowerCase()}`}
                            className="rounded-lg bg-cyan-500/10 px-3 py-1.5 text-[10px] font-black text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all uppercase tracking-widest shadow-sm"
                        >
                            {cat}
                        </Link>
                    ))}
                    {rule.tags.map((tag) => (
                        <span key={tag} className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-slate-800 uppercase tracking-widest">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Version History & Actions */}
                <div className="grid gap-8 lg:grid-cols-[1fr_auto] items-start mb-12">
                    <RuleActions
                        content={rule.content}
                        slug={slugPath}
                        title={rule.title}
                        author={rule.author}
                        category={rule.category}
                        difficulty={rule.difficulty}
                        excerpt={rule.excerpt}
                        created={rule.created}
                        tags={rule.tags}
                    />
                </div>

                {/* Content */}
                <article
                    className="prose prose-invert prose-slate max-w-none 
                    prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                    prose-a:text-purple-400 hover:prose-a:text-purple-300
                    prose-code:text-cyan-300 prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-2xl
                    pb-20 border-b border-slate-800 font-noto leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {/* Version History Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-tighter flex items-center gap-3">
                        <span className="h-1 w-8 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                        Version History
                    </h2>
                    <VersionHistory slug={slugPath} currentContent={rule.content} />
                </div>
            </div>
        </div>
    );
}
