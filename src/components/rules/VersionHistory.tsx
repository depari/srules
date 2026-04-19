'use client';

import { useState, useEffect } from 'react';
import ReactDiffViewer from '@alexbruf/react-diff-viewer';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredToken, setStoredToken, removeStoredToken } from '@/lib/storage';

interface Commit {
    hash: string;
    author: string;
    date: string;
    message: string;
}

interface VersionHistoryProps {
    slug: string;
    currentContent: string;
}

export default function VersionHistory({ slug, currentContent }: VersionHistoryProps) {
    const [history, setHistory] = useState<Commit[]>([]);
    const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
    const [historicalContent, setHistoricalContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [tokenInput, setTokenInput] = useState('');

    useEffect(() => {
        const stored = getStoredToken();
        if (stored) setUserToken(stored);
    }, []);

    useEffect(() => {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        fetch(`${basePath}/rule-history.json`)
            .then(res => res.json())
            .then(data => {
                const ruleHistory = data[slug] || [];
                setHistory(ruleHistory);
            })
            .catch(err => console.error('Failed to load version history:', err));
    }, [slug]);

    const fetchHistoricalContent = async (commit: Commit) => {
        setIsLoading(true);
        setError(null);
        setSelectedCommit(commit);

        try {
            const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'depari';
            const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'srules';
            const token = userToken || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

            const url = `https://api.github.com/repos/${owner}/${repo}/contents/rules/${slug}.md?ref=${commit.hash}`;

            const response = await fetch(url, {
                headers: token ? {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3.raw'
                } : {
                    'Accept': 'application/vnd.github.v3.raw'
                }
            });

            if (!response.ok) {
                if (response.status === 403) throw new Error('GitHub API rate limit exceeded. Please set your token.');
                throw new Error('Failed to fetch historical content.');
            }

            const content = await response.text();
            setHistoricalContent(content);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred.');
            setHistoricalContent(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveToken = () => {
        if (!tokenInput.trim()) return;
        setStoredToken(tokenInput.trim());
        setUserToken(tokenInput.trim());
        setTokenInput('');
        setShowTokenInput(false);
        setError(null);
    };

    const handleRemoveToken = () => {
        removeStoredToken();
        setUserToken(null);
    };

    if (history.length === 0) {
        return (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center backdrop-blur-sm">
                <p className="text-slate-400 font-medium">No version history found for this rule.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Commit List Section */}
                <div className="w-full lg:w-[320px] space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-violet-500/10">
                                <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            {history.length} Versions
                        </h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowTokenInput(!showTokenInput)}
                                className={`p-2 rounded-xl transition-all ${userToken ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'}`}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {showTokenInput && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-3 z-50 w-72 rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl backdrop-blur-xl"
                                    >
                                        <h4 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-[0.15em]">GitHub Auth</h4>
                                        {userToken ? (
                                            <div className="space-y-4">
                                                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                                    <p className="text-xs text-emerald-400 font-medium flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                        Token active
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleRemoveToken}
                                                    className="w-full rounded-xl bg-rose-500/10 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all"
                                                >
                                                    Remove Token
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <input
                                                    type="password"
                                                    value={tokenInput}
                                                    onChange={(e) => setTokenInput(e.target.value)}
                                                    placeholder="ghp_..."
                                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none transition-all"
                                                />
                                                <p className="text-[10px] text-slate-500 leading-normal">
                                                    Enter a Personal Access Token (classic) with <code className="text-violet-400">public_repo</code> scope to avoid rate limits. Stored locally.
                                                </p>
                                                <button
                                                    onClick={handleSaveToken}
                                                    className="w-full rounded-xl bg-violet-600 py-2.5 text-xs font-bold text-white hover:bg-violet-500 shadow-lg shadow-violet-600/20 transition-all"
                                                >
                                                    Authenticate
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                        {history.map((commit, index) => (
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={commit.hash}
                                onClick={() => fetchHistoricalContent(commit)}
                                className={`w-full text-left rounded-2xl border p-4 transition-all group ${selectedCommit?.hash === commit.hash
                                    ? 'border-violet-500/40 bg-violet-500/10 shadow-lg shadow-violet-500/5'
                                    : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${selectedCommit?.hash === commit.hash ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-slate-500'}`}>
                                        {commit.hash.substring(0, 7)}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500">{commit.date}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                                    {commit.message}
                                </p>
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="h-4 w-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/5" />
                                    <span className="text-[10px] font-bold text-slate-500">{commit.author}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Diff Viewer Section */}
                <div className="flex-1 min-h-[500px] rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col backdrop-blur-sm overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!selectedCommit ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex items-center justify-center p-12 text-center"
                            >
                                <div className="space-y-6 max-w-sm">
                                    <div className="mx-auto w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center animate-float">
                                        <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Select a version</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">Choose a commit from the history to view changes against the current version.</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : isLoading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex items-center justify-center"
                            >
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
                                    <div className="absolute inset-0 h-12 w-12 rounded-full border border-violet-500/10 animate-pulse" />
                                </div>
                            </motion.div>
                        ) : error ? (
                            <motion.div 
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex-1 flex items-center justify-center p-8 text-center"
                            >
                                <div className="space-y-6">
                                    <div className="p-4 rounded-full bg-rose-500/10 inline-block">
                                        <svg className="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <p className="text-rose-400 font-medium max-w-xs mx-auto">{error}</p>
                                    {!userToken && (
                                        <button
                                            onClick={() => setShowTokenInput(true)}
                                            className="px-6 py-2.5 rounded-xl bg-white/5 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 border border-white/5 transition-all"
                                        >
                                            Configure Token
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ) : historicalContent ? (
                            <motion.div 
                                key="diff"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col p-6"
                            >
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-emerald-400/80">Current</span>
                                        </div>
                                        <div className="h-3 w-px bg-white/10" />
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-rose-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-rose-400/80">{selectedCommit.hash.substring(0, 7)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCommit(null)}
                                        className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-1 overflow-hidden rounded-2xl border border-white/5 shadow-inner">
                                    <div className="h-full overflow-auto text-[11px] leading-relaxed">
                                        <ReactDiffViewer
                                            oldValue={historicalContent}
                                            newValue={currentContent}
                                            splitView={true}
                                            useDarkTheme={true}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
