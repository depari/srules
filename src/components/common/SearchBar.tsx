'use client';

import { useState, useMemo, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useSearch } from '@/hooks/queries/useSearchQueries';
import { useDebounce } from '@/hooks/useDebounce';

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

    // UI용 결과 데이터 변환 (SearchResult -> Item)
    const results = useMemo(() => {
        return searchResults?.map(result => result.item) ?? [];
    }, [searchResults]);

    // 검색어가 있고 결과가 있으면 자동으로 열기 (사용자가 입력 중일 때)
    useEffect(() => {
        // query가 있고(사용자 입력), debouncedQuery가 같을 때(검색 완료), 결과가 있으면 오픈
        if (query && query === debouncedQuery && results.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsOpen(true);
        } else if (!query) {
            setIsOpen(false);
        }
    }, [query, debouncedQuery, results.length]);

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

    const defaultPlaceholder = isCompact ? "규칙 검색..." : "규칙, 프레임워크, 언어로 검색하세요...";

    return (
        <div className="search-container relative w-full">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className={`${isCompact ? 'h-4 w-4' : 'h-5 w-5'} text-slate-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && results.length > 0 && setIsOpen(true)}
                    placeholder={placeholder || defaultPlaceholder}
                    className={`w-full rounded-lg border border-slate-700 bg-slate-900/50 py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${isCompact ? 'py-2 pl-10 text-sm' : 'py-4 pl-12 text-lg rounded-full'}`}
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setIsOpen(false);
                        }}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* 검색 결과 드롭다운 */}
            {isOpen && results.length > 0 && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 shadow-2xl max-h-[60vh] overflow-y-auto">
                    <div className="p-2">
                        {results.map((result) => (
                            <Link
                                key={result.slug}
                                href={`/rules/${result.slug}`}
                                onClick={() => {
                                    setIsOpen(false);
                                    setQuery('');
                                }}
                                className="flex flex-col gap-2 rounded-lg p-3 hover:bg-slate-800 transition-colors group"
                            >
                                <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">{result.title}</h3>
                                    {result.difficulty && (
                                        <span className="ml-2 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400 shrink-0">
                                            {result.difficulty}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 line-clamp-2">
                                    {result.excerpt}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.category.slice(0, 2).map((cat) => (
                                        <span
                                            key={cat}
                                            className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-400"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                    {result.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* 검색 결과 없음 */}
            {isOpen && debouncedQuery && results.length === 0 && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl">
                    <p className="text-slate-400">&quot;{query}&quot;에 대한 검색 결과가 없습니다.</p>
                </div>
            )}
        </div>
    );
}
