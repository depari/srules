import { Link } from '@/i18n/routing';

interface RuleCardProps {
    slug: string;
    title: string;
    excerpt?: string;
    author?: string;
    created: string;
    difficulty?: string;
    category: string[];
    tags: string[];
    featured?: boolean;
}

export default function RuleCard({
    slug,
    title,
    excerpt,
    author,
    created,
    difficulty,
    category,
    tags,
    featured
}: RuleCardProps) {
    return (
        <Link
            href={`/rules/${slug}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 block"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1 tracking-tight">
                        {title}
                    </h3>
                    {excerpt && (
                        <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
                            {excerpt}
                        </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                        {author && (
                            <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {author}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {created}
                        </span>
                        {difficulty && (
                            <span className={`rounded-md px-2 py-1 uppercase tracking-tighter ${difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                                    difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-rose-500/10 text-rose-400'
                                }`}>
                                {difficulty}
                            </span>
                        )}
                    </div>
                </div>

                {featured && (
                    <div className="ml-4 shrink-0">
                        <span className="inline-flex items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 p-1 shadow-lg shadow-amber-500/20">
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
                {category.map((cat) => (
                    <span
                        key={cat}
                        className="rounded-lg bg-cyan-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-400 border border-cyan-500/20"
                    >
                        {cat}
                    </span>
                ))}
                {tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="rounded-lg bg-slate-800/50 px-2 py-1 text-[10px] font-bold text-slate-400"
                    >
                        #{tag}
                    </span>
                ))}
                {tags.length > 3 && (
                    <span className="rounded-lg bg-slate-800/50 px-2 py-1 text-[10px] font-bold text-slate-500">
                        +{tags.length - 3}
                    </span>
                )}
            </div>
        </Link>
    );
}
