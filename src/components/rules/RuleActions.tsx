'use client';

import { useState, useEffect } from 'react';

import { Link } from '@/i18n/routing';
import { createGitHubClient } from '@/lib/github';
import { toggleFavorite, isFavorite, addRecentView } from '@/lib/storage';

interface RuleActionsProps {
    content: string;
    slug: string;
    title: string;
    author?: string;
    category: string[];
    difficulty?: string;
    excerpt?: string;
    created: string;
    tags: string[];
}

export default function RuleActions({
    content,
    slug,
    title,
    author,
    category,
    difficulty,
    excerpt,
    created,
    tags
}: RuleActionsProps) {
    const [copied, setCopied] = useState(false);
    const [sharesCopied, setShareCopied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletePrUrl, setDeletePrUrl] = useState<string | null>(null);
    const [favorited, setFavorited] = useState(false);

    // 페이지 로드 시 최근 본 규칙 추가 및 즐겨찾기 상태 확인
    useEffect(() => {
        addRecentView(slug, title);
        setFavorited(isFavorite(slug));
    }, [slug, title]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug.replace(/\//g, '-')}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
    };

    const handleFavorite = () => {
        const isAdded = toggleFavorite({
            slug,
            title,
            category,
            difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced' | undefined,
            excerpt: excerpt || '',
            created,
            tags,
            author: author || 'Anonymous'
        });
        setFavorited(isAdded);
        window.dispatchEvent(new CustomEvent('favorites-updated'));
    };

    const handleDelete = async () => {
        if (!confirm('정말로 이 규칙을 삭제하시겠습니까? 삭제 요청 Pull Request가 생성됩니다.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const client = createGitHubClient();
            if (!client) {
                alert('GitHub 토큰이 설정되지 않아 삭제 기능을 사용할 수 없습니다.');
                return;
            }

            const { prUrl } = await client.deleteRule({
                title,
                originalPath: `rules/${slug}.md`,
                author: author || 'Anonymous'
            });

            setDeletePrUrl(prUrl);
            alert('삭제 요청 PR이 성공적으로 생성되었습니다.');
        } catch (error) {
            console.error('Delete error:', error);
            alert('삭제 요청 중 오류가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (deletePrUrl) {
        return (
            <div className="mb-8 rounded-lg bg-red-500/10 border border-red-500/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">삭제 요청이 생성되었습니다</p>
                        <p className="text-xs text-slate-400">관리자가 PR을 검토한 후 삭제가 완료됩니다.</p>
                    </div>
                </div>
                <Link
                    href={deletePrUrl}
                    target="_blank"
                    className="w-full sm:w-auto text-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                    PR 확인하기
                </Link>
            </div>
        );
    }

    return (
        <div className="mb-8 flex flex-wrap gap-3">
            <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${favorited
                    ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
            >
                <svg className={`h-4 w-4 ${favorited ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.07 6.323a1 1 0 00.95.69h6.642c.969 0 1.371 1.24.588 1.81l-5.378 3.908a1 1 0 00-.364 1.118l2.07 6.323c.3.921-.755 1.688-1.54 1.118l-5.378-3.908a1 1 0 00-1.175 0l-5.378 3.908c-.784.57-1.838-.197-1.539-1.118l2.07-6.323a1 1 0 00-.364-1.118L2.293 11.75c-.783-.57-.38-1.81.588-1.81h6.642a1 1 0 00.95-.69l2.07-6.323z" />
                </svg>
                {favorited ? '즐겨찾기 취소' : '즐겨찾기'}
            </button>

            <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? '복사됨!' : '복사'}
            </button>

            <Link
                href={`/submit?edit=${slug}`}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                수정
            </Link>

            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-50"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {isDeleting ? '삭제 중...' : '삭제'}
            </button>
            <div className="h-8 w-px bg-slate-800 mx-1 hidden sm:block"></div>
            <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                다운로드
            </button>
            <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {sharesCopied ? 'URL 복사됨!' : '공유'}
            </button>
        </div>
    );
}
