'use client';

import { useState, useEffect } from 'react';
import ReactDiffViewer from '@alexbruf/react-diff-viewer';
import { getStoredToken, setStoredToken, removeStoredToken } from '@/lib/storage';

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
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [tokenInput, setTokenInput] = useState('');

    // 초기 토큰 로드
    useEffect(() => {
        const stored = getStoredToken();
        if (stored) {
            setUserToken(stored);
        }
    }, []);

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
            // 우선순위: 사용자 입력 토큰 > ENV 토큰
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
                if (response.status === 403) {
                    throw new Error('API 호출 한도 초과. GitHub 토큰을 설정해주세요.');
                }
                throw new Error('이전 버전을 불러오는데 실패했습니다.');
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

    const handleSaveToken = () => {
        if (!tokenInput.trim()) return;
        setStoredToken(tokenInput.trim());
        setUserToken(tokenInput.trim());
        setTokenInput('');
        setShowTokenInput(false);
        setError(null); // 에러 초기화
    };

    const handleRemoveToken = () => {
        removeStoredToken();
        setUserToken(null);
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
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            변경 이력 ({history.length})
                        </h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowTokenInput(!showTokenInput)}
                                className={`p-1.5 rounded-lg transition-colors ${userToken ? 'text-green-400 bg-green-400/10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
                                title={userToken ? "토큰 설정됨" : "GitHub 토큰 설정"}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </button>

                            {/* 토큰 입력 팝업 */}
                            {showTokenInput && (
                                <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-xl">
                                    <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">GitHub Token 설정</h4>
                                    {userToken ? (
                                        <div className="space-y-3">
                                            <p className="text-xs text-green-400">✅ 토큰이 설정되어 있습니다.</p>
                                            <button
                                                onClick={handleRemoveToken}
                                                className="w-full rounded-lg bg-red-500/10 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20"
                                            >
                                                토큰 삭제
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <input
                                                type="password"
                                                value={tokenInput}
                                                onChange={(e) => setTokenInput(e.target.value)}
                                                placeholder="ghp_..."
                                                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                                            />
                                            <p className="text-[10px] text-slate-500 leading-tight">
                                                GitHub Pages는 정적 사이트이므로, API 호출 한도를 늘리려면 개인 토큰(Read Only)이 필요합니다. 토큰은 브라우저에만 저장됩니다.
                                            </p>
                                            <button
                                                onClick={handleSaveToken}
                                                className="w-full rounded-lg bg-purple-600 py-2 text-xs font-bold text-white hover:bg-purple-500"
                                            >
                                                저장
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {history.map((commit) => (
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
                            <p className="mb-4">{error}</p>
                            {/* 에러 발생 시 토큰 입력 유도 */}
                            {!userToken && (
                                <button
                                    onClick={() => setShowTokenInput(true)}
                                    className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-purple-400 hover:bg-slate-700"
                                >
                                    GitHub 토큰 설정하기
                                </button>
                            )}
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
        </div>
    );
}
