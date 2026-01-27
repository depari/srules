'use client';

import { useState, useEffect } from 'react';
import ReactDiffViewer from '@alexbruf/react-diff-viewer';

interface Commit {
    hash: string;
    author: string;
    date: string;
    message: string;
}

interface VersionHistoryProps {
    slug: string; // e.g., "typescript/strict-mode"
    currentContent: string;
}

export default function VersionHistory({ slug, currentContent }: VersionHistoryProps) {
    const [history, setHistory] = useState<Commit[]>([]);
    const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
    const [historicalContent, setHistoricalContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 로그 데이터 로드
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

    // 과거 버전 콘텐츠 가져오기 (GitHub API 사용)
    const fetchHistoricalContent = async (commit: Commit) => {
        setIsLoading(true);
        setError(null);
        setSelectedCommit(commit);

        try {
            const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'depari';
            const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'srules';
            const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

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
                if (response.status === 403) throw new Error('API Rate limit exceeded or unauthorized. Please set GitHub Token.');
                throw new Error('Failed to fetch historical content.');
            }

            const content = await response.text();
            setHistoricalContent(content);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            setHistoricalContent(null);
        } finally {
            setIsLoading(false);
        }
    };

    if (history.length === 0) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
                <p className="text-slate-400 text-sm">기록된 버전 히스토리가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* 리스트 섹션 */}
                <div className="w-full lg:w-1/3 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        변경 이력 ({history.length})
                    </h3>
                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {history.map((commit, index) => (
                            <button
                                key={commit.hash}
                                onClick={() => fetchHistoricalContent(commit)}
                                className={`w-full text-left rounded-lg border p-3 transition-all ${selectedCommit?.hash === commit.hash
                                    ? 'border-purple-500 bg-purple-500/10'
                                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-xs font-mono ${selectedCommit?.hash === commit.hash ? 'text-purple-400' : 'text-slate-500'
                                        }`}>
                                        {commit.hash.substring(0, 7)}
                                    </span>
                                    <span className="text-xs text-slate-500">{commit.date}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-200 line-clamp-1">{commit.message}</p>
                                <p className="text-xs text-slate-500 mt-1">{commit.author}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Diff 뷰어 섹션 */}
                <div className="w-full lg:w-2/3 min-h-[400px] rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col">
                    {!selectedCommit ? (
                        <div className="flex-1 flex flex-center items-center justify-center p-12 text-center">
                            <div className="space-y-3">
                                <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <p className="text-slate-400">변경 사항을 확인하려면 커밋을 선택하세요.</p>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex items-center justify-center p-6 text-center text-red-400">
                            <p>{error}</p>
                        </div>
                    ) : historicalContent ? (
                        <div className="flex-1 flex flex-col p-4">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className="text-sm">
                                    <span className="text-green-400">Current</span> vs
                                    <span className="text-red-400 ml-2">{selectedCommit.hash.substring(0, 7)}</span>
                                </div>
                                <button
                                    onClick={() => setHistoricalContent(null)}
                                    className="text-xs text-slate-500 hover:text-white"
                                >
                                    닫기
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto rounded-lg border border-slate-800 overflow-hidden text-xs">
                                <ReactDiffViewer
                                    oldValue={historicalContent}
                                    newValue={currentContent}
                                    splitView={true}
                                    useDarkTheme={true}
                                />
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* API Info Alert */}
            {!process.env.NEXT_PUBLIC_GITHUB_TOKEN && (
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 flex gap-3">
                    <svg className="h-5 w-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-xs text-amber-200/80">
                        비로그인 상태에서는 GitHub API 호출 제한이 발생할 수 있습니다.
                        상세한 변경 이력을 자유롭게 확인하려면 <code className="bg-amber-900/30 px-1 rounded">GITHUB_TOKEN</code>을 설정해주세요.
                    </p>
                </div>
            )}
        </div>
    );
}
