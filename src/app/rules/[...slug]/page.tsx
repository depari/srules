import Link from "next/link";
import { notFound } from "next/navigation";
import { getRuleBySlug, markdownToHtml, getAllRules } from "@/lib/rules";
import RuleActions from "@/components/rules/RuleActions";

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export async function generateStaticParams() {
    const rules = getAllRules();
    return rules.map((rule) => ({
        slug: rule.slug.split('/'),
    }));
}

export default async function RulePage({ params }: PageProps) {
    const { slug } = await params;

    // slug 배열을 경로로 합치기
    const slugPath = slug.join('/');
    const rule = getRuleBySlug(slugPath);

    if (!rule) {
        notFound();
    }

    const htmlContent = await markdownToHtml(rule.content);

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

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
                    <Link href="/" className="hover:text-white">홈</Link>
                    <span>/</span>
                    <Link href="/rules" className="hover:text-white">규칙</Link>
                    <span>/</span>
                    <span className="text-white">{rule.title}</span>
                </nav>

                {/* Title and Meta */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white">{rule.title}</h1>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        {rule.author && (
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{rule.author}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{rule.created}</span>
                        </div>
                        {rule.updated && rule.updated !== rule.created && (
                            <div className="flex items-center gap-2">
                                <span>수정: {rule.updated}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span>v{rule.version}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {rule.category.map((cat) => (
                            <Link
                                key={cat}
                                href={`/categories/${cat.toLowerCase()}`}
                                className="rounded-md bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400 hover:bg-cyan-500/20"
                            >
                                {cat}
                            </Link>
                        ))}
                        {rule.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/tags/${tag.toLowerCase()}`}
                                className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-300 hover:bg-slate-700"
                            >
                                {tag}
                            </Link>
                        ))}
                        {rule.difficulty && (
                            <span className="rounded-md bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400">
                                {rule.difficulty}
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <RuleActions content={rule.content} slug={rule.slug} />

                {/* Content */}
                <article
                    className="prose prose-invert prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-white
            prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2
            prose-h3:text-xl prose-h4:text-lg
            prose-p:text-slate-300 prose-p:leading-7
            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-cyan-400 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800
            prose-ul:text-slate-300 prose-ol:text-slate-300
            prose-li:text-slate-300
            prose-blockquote:border-l-purple-500 prose-blockquote:text-slate-400
            prose-hr:border-slate-800"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </div>
        </div>
    );
}
