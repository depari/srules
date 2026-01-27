import Link from 'next/link';

interface RuleCardProps {
    slug: string;
    title: string;
    excerpt: string;
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
            className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                        {excerpt}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        {author && (
                            <span className="flex items-center gap-1.5">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {author}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {created}
                        </span>
                        {difficulty && (
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficulty === 'beginner' ? 'bg-green-500/10 text-green-400' :
                                    difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-red-500/10 text-red-400'
                                }`}>
                                {difficulty}
                            </span>
                        )}
                    </div>
                </div>

                {featured && (
                    <div className="ml-4">
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
                            ⭐ Featured
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {category.map((cat) => (
                    <span
                        key={cat}
                        className="rounded-md bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-400"
                    >
                        {cat}
                    </span>
                ))}
                {tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
                    >
                        {tag}
                    </span>
                ))}
                {tags.length > 3 && (
                    <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                        +{tags.length - 3}
                    </span>
                )}
            </div>
        </Link>
    );
}
