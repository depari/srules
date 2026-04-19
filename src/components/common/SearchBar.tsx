'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useSearch } from '@/hooks/queries/useSearchQueries';
import { useDebounce } from '@/hooks/useDebounce';
import HighlightedText from './HighlightedText';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
    variant?: 'default' | 'compact';
    placeholder?: string;
}

export default function SearchBar({ variant = 'default', placeholder }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // 검색어 디바운싱 (300ms)
    const debouncedQuery = useDebounce(query, 300);

    // 검색 서비스 Hook 사용 (엔진 추상화)
    const { data: searchResults } = useSearch(debouncedQuery);

    const isCompact = variant === 'compact';


    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.search-container')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const defaultPlaceholder = isCompact ? "Search..." : "Search for rules, frameworks, languages...";

    return (
        <div className="search-container relative w-full">
            <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-purple-400">
                    <svg className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} text-slate-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        const val = e.target.value;
                        setQuery(val);
                        if (val) setIsOpen(true);
                        else setIsOpen(false);
                    }}
                    onFocus={() => query && searchResults && searchResults.length > 0 && setIsOpen(true)}
                    placeholder={placeholder || defaultPlaceholder}
                    className={`w-full border shadow-2xl transition-all duration-300 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 
                        ${isCompact ? 'py-2 pl-10 text-sm rounded-xl border-white/5 bg-white/5 focus:border-violet-500/50 focus:bg-white/10' : 'py-5 pl-14 pr-6 text-xl rounded-2xl border-white/10 bg-white/5 focus:border-violet-500/50 backdrop-blur-xl font-black tracking-tight'}`}
                />
                
                {!isCompact && !query && (
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <kbd className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-500 text-[10px] font-black tracking-widest flex items-center gap-1 shadow-inner translate-y-[1px]">
                            <span className="text-xs">⌘</span> K
                        </kbd>
                    </div>
                )}
                
                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => {
                                setQuery('');
                                setIsOpen(false);
                            }}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-white"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* 검색 결과 드롭다운 */}
            <AnimatePresence>
                {isOpen && searchResults && searchResults.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute z-50 mt-4 w-full rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-[70vh] overflow-hidden"
                    >
                        <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(70vh-16px)]">
                            {searchResults.map((result) => {
                                const titleMatch = result.matches?.find(m => m.key === 'title');
                                const excerptMatch = result.matches?.find(m => m.key === 'excerpt');
                                
                                return (
                                    <Link
                                        key={result.item.slug}
                                        href={`/rules/${result.item.slug}`}
                                        onClick={() => {
                                            setIsOpen(false);
                                            setQuery('');
                                        }}
                                        className="flex flex-col gap-2 rounded-xl p-4 hover:bg-white/5 transition-all group relative border border-transparent hover:border-white/5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                                                <HighlightedText 
                                                    text={result.item.title} 
                                                    indices={titleMatch?.indices} 
                                                />
                                            </h3>
                                            {result.item.difficulty && (
                                                <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter border ${
                                                    result.item.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' :
                                                    result.item.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' :
                                                    'bg-rose-500/10 text-rose-400 border-rose-500/10'
                                                }`}>
                                                    {result.item.difficulty}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-medium">
                                            <HighlightedText 
                                                text={result.item.excerpt || ''} 
                                                indices={excerptMatch?.indices} 
                                            />
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {result.item.category.slice(0, 2).map((cat) => (
                                                <span
                                                    key={cat}
                                                    className="rounded-lg bg-cyan-500/5 px-2 py-1 text-[10px] font-black text-cyan-400 border border-cyan-500/10 uppercase tracking-tighter"
                                                >
                                                    {cat}
                                                </span>
                                            ))}
                                            {result.item.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-lg bg-white/5 px-2 py-1 text-[10px] font-bold text-slate-500 border border-white/5"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 검색 결과 없음 */}
            <AnimatePresence>
                {isOpen && debouncedQuery && searchResults && searchResults.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 mt-4 w-full rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl p-10 text-center shadow-2xl"
                    >
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-slate-800 p-4">
                                <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No results found</h3>
                        <p className="text-slate-400 font-medium">We couldn&apos;t find anything matching &quot;{query}&quot;</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
