'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/queries/useSearchQueries';
import { useDebounce } from '@/hooks/useDebounce';
import HighlightedText from './HighlightedText';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();
    
    const debouncedQuery = useDebounce(query, 200);
    const { data: searchResults } = useSearch(debouncedQuery);

    const toggle = useCallback((e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setIsOpen(prev => !prev);
        }
        if (e.key === 'Escape' && isOpen) {
            setIsOpen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        window.addEventListener('keydown', toggle);
        return () => window.removeEventListener('keydown', toggle);
    }, [toggle]);

    const navigate = (slug: string) => {
        router.push(`/rules/${slug}`);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
                    />
                    <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-3xl shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto backdrop-blur-3xl"
                        >
                            <div className="flex items-center border-b border-white/5 px-6 py-4">
                                <svg className="h-6 w-6 text-violet-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    autoFocus
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Type a command or search rules..."
                                    className="flex-1 bg-transparent border-none text-white text-xl placeholder-slate-500 focus:outline-none focus:ring-0 font-black tracking-tight"
                                />
                                <div className="flex items-center gap-1">
                                    <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-400 font-black">ESC</kbd>
                                </div>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                                {query === '' && (
                                    <div className="p-6 text-center">
                                        <p className="text-slate-500 font-bold mb-4 uppercase tracking-[0.2em] text-[10px]">Quick Actions</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button 
                                                onClick={() => {
                                                    router.push('/');
                                                    setIsOpen(false);
                                                }} 
                                                className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 text-slate-300 transition-all text-left"
                                            >
                                                <div className="p-2 rounded-lg bg-violet-600/10 text-violet-400">
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                </div>
                                                <span className="font-bold">Go to Dashboard</span>
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    router.push('/submit');
                                                    setIsOpen(false);
                                                }} 
                                                className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-slate-300 transition-all text-left"
                                            >
                                                <div className="p-2 rounded-lg bg-cyan-600/10 text-cyan-400">
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </div>
                                                <span className="font-bold">Add New Rule</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {searchResults && searchResults.map((result) => {
                                    const titleMatch = result.matches?.find(m => m.key === 'title');
                                    return (
                                        <button
                                            key={result.item.slug}
                                            onClick={() => navigate(result.item.slug)}
                                            className="w-full flex items-center justify-between gap-4 rounded-2xl p-4 hover:bg-white/5 transition-all text-left group border border-transparent hover:border-white/5"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="p-2 rounded-xl bg-slate-800 text-slate-500 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                                                        <HighlightedText text={result.item.title} indices={titleMatch?.indices} />
                                                    </h4>
                                                    <p className="text-xs text-slate-500 font-medium truncate">{result.item.category.join(' / ')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-lg px-2 py-0.5 bg-white/5 text-[10px] font-black uppercase text-slate-500 border border-white/5 group-hover:border-violet-500/20 group-hover:text-violet-400">Enter</span>
                                            </div>
                                        </button>
                                    );
                                })}

                                {query && searchResults && searchResults.length === 0 && (
                                    <div className="p-12 text-center">
                                        <p className="text-slate-500 font-bold">No rules found for &quot;{query}&quot;</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white/5 px-6 py-3 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400">↑↓</kbd>
                                        <span>Navigate</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400">Enter</kbd>
                                        <span>Select</span>
                                    </div>
                                </div>
                                <div>SpecSafe Rules Search</div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
