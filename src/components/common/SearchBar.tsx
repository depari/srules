'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { SearchIndexItem } from '@/types/rule';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchIndexItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [fuse, setFuse] = useState<Fuse<SearchIndexItem> | null>(null);

    // 검색 인덱스 로드
    useEffect(() => {
        fetch('/search-index.json')
            .then(res => res.json())
            .then((data: SearchIndexItem[]) => {
                const fuseInstance = new Fuse(data, {
                    keys: [
                        { name: 'title', weight: 2 },
                        { name: 'tags', weight: 1.5 },
                        { name: 'category', weight: 1.5 },
                        { name: 'excerpt', weight: 1 },
                        { name: 'author', weight: 0.5 },
                    ],
                    threshold: 0.4,
                    includeScore: true,
                });
                setFuse(fuseInstance);
            })
            .catch(err => console.error('Failed to load search index:', err));
    }, []);

    // 검색 실행
    useEffect(() => {
        if (!fuse || !query.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const searchResults = fuse.search(query);
        setResults(searchResults.slice(0, 5).map(result => result.item));
        setIsOpen(searchResults.length > 0);
    }, [query, fuse]);

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

    return (
        <div className="search-container relative w-full">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && results.length > 0 && setIsOpen(true)}
                    placeholder="규칙, 프레임워크, 언어로 검색하세요..."
                    className="w-full rounded-full border border-slate-700 bg-slate-900/50 py-4 pl-12 pr-4 text-lg text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setResults([]);
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
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 shadow-2xl">
                    <div className="p-2">
                        {results.map((result) => (
                            <Link
                                key={result.slug}
                                href={`/rules/${result.path}`}
                                onClick={() => {
                                    setIsOpen(false);
                                    setQuery('');
                                }}
                                className="flex flex-col gap-2 rounded-lg p-3 hover:bg-slate-800 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-white">{result.title}</h3>
                                    {result.difficulty && (
                                        <span className="ml-2 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400">
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
                    <div className="border-t border-slate-700 p-2 text-center">
                        <p className="text-xs text-slate-500">
                            Enter를 눌러 모든 결과 보기
                        </p>
                    </div>
                </div>
            )}

            {/* 검색 결과 없음 */}
            {isOpen && query && results.length === 0 && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl">
                    <p className="text-slate-400">"{query}"에 대한 검색 결과가 없습니다.</p>
                </div>
            )}
        </div>
    );
}
