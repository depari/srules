'use client';

import { useRef } from 'react';
import RuleActions from './RuleActions';
import VersionHistory from './VersionHistory';
import ReadingProgress from './ReadingProgress';
import { motion } from 'framer-motion';
import { nameToSlug } from '@/lib/slug';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface RuleDetailProps {
    rule: any;
    htmlContent: string;
    slugPath: string;
}

export default function RuleDetail({ rule, htmlContent, slugPath }: RuleDetailProps) {
    const t = useTranslations('common');
    const exportRef = useRef<HTMLDivElement>(null);

    return (
        <div className="py-8">
            <ReadingProgress />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <motion.nav 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8 flex items-center gap-2 text-sm text-slate-400 font-bold uppercase tracking-widest text-[10px]"
                >
                    <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                    <span className="text-slate-700">/</span>
                    <Link href="/rules" className="hover:text-white transition-colors" data-testid="breadcrumb-list">{t('list')}</Link>
                    <span className="text-slate-700">/</span>
                    <span className="text-white line-clamp-1">{rule.title}</span>
                </motion.nav>

                <div ref={exportRef} className="rounded-3xl p-2 transition-all duration-500">
                    {/* Title and Meta */}
                    <div className="mb-8">
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight tracking-tighter"
                        >
                            {rule.title}
                        </motion.h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-medium" data-testid="rule-metadata">
                            {rule.author && (
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-xs font-black text-violet-400 shadow-inner">
                                        {rule.author.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-bold text-slate-300">{rule.author}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                                </svg>
                                <span>{rule.created}</span>
                            </div>
                            {rule.difficulty && (
                                <span className={`rounded-xl px-3 py-1 text-[10px] font-black border uppercase tracking-[0.2em] ${
                                    rule.difficulty === 'beginner' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' :
                                    rule.difficulty === 'intermediate' ? 'bg-amber-500/5 text-amber-500 border-amber-500/10' :
                                    'bg-rose-500/5 text-rose-400 border-rose-500/10'
                                }`}>
                                    {rule.difficulty}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Categories & Tags */}
                    <div className="mb-10 flex flex-wrap gap-2">
                        {rule.category.map((cat: string) => (
                            <Link
                                key={cat}
                                href={`/categories/${nameToSlug(cat)}`}
                                className="rounded-xl bg-violet-500/5 px-3 py-1.5 text-[10px] font-black text-violet-400 border border-violet-500/10 hover:bg-violet-500/10 transition-all uppercase tracking-widest shadow-sm"
                            >
                                {cat}
                            </Link>
                        ))}
                        {rule.tags.map((tag: string) => (
                            <span key={tag} className="rounded-xl bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-white/5 uppercase tracking-widest">
                                # {tag}
                            </span>
                        ))}
                    </div>

                    {/* Version History & Actions */}
                    <div className="flex flex-wrap items-center gap-4 mb-12">
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
                            contentRef={exportRef}
                        />
                    </div>

                    {/* Content */}
                    <article
                        className="prose prose-invert prose-slate max-w-none 
                        prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                        prose-a:text-violet-400 hover:prose-a:text-violet-300
                        prose-code:text-cyan-300 prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-3xl
                        pb-20 border-b border-white/5 font-medium leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </div>

                {/* Version History Section */}
                <div className="mt-20">
                    <h2 className="text-2xl font-black mb-10 text-white uppercase tracking-tighter flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-500/10 text-violet-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        Version History
                    </h2>
                    <VersionHistory slug={slugPath} currentContent={rule.content} />
                </div>
            </div>
        </div>
    );
}
