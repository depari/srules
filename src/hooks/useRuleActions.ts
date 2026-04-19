/**
 * Rule Actions 커스텀 훅
 * 각 액션의 비즈니스 로직을 독립적인 훅으로 분리
 * React Query를 통해 상태 관리 최적화
 */

import { useState, useEffect, useCallback, RefObject } from 'react';
import { toPng } from 'html-to-image';
import type { FavoriteItem } from '@/types/rule';
import { useIsFavorite, useToggleFavorite } from '@/hooks/queries/useFavoriteQueries';
import { useAddRecentView } from '@/hooks/queries/useRecentViewQueries';
import { useDeleteRuleMutation } from '@/hooks/queries/useGitHubQueries';

/**
 * 규칙 복사 훅
 */
export function useCopyRule(content: string) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return { copied, copy };
}

/**
 * 규칙 다운로드 훅
 */
export function useDownloadRule(slug: string, content: string) {
    const download = () => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug.replace(/\//g, '-')}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return { download };
}

/**
 * 규칙 공유 훅
 */
export function useShareRule() {
    const [sharesCopied, setShareCopied] = useState(false);

    const copyUrl = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
    };

    const shareNative = async (title: string, text: string) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            copyUrl();
        }
    };

    return { sharesCopied, copyUrl, shareNative };
}

/**
 * 이미지 익스포트 훅
 */
export function useExportImage<T extends HTMLElement>(ref: RefObject<T | null>, fileName: string) {
    const [isExporting, setIsExporting] = useState(false);

    const exportImage = useCallback(async () => {
        if (ref.current === null) return;

        setIsExporting(true);
        try {
            // 스타일 보정을 위한 약간의 대기
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const dataUrl = await toPng(ref.current, {
                cacheBust: true,
                backgroundColor: '#020617', // slate-950
                style: {
                    borderRadius: '16px',
                }
            });

            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Export failed:', err);
            alert('이미지 저장 중 오류가 발생했습니다.');
        } finally {
            setIsExporting(false);
        }
    }, [ref, fileName]);

    return { isExporting, exportImage };
}

/**
 * 즐겨찾기 훅 (React Query 적용)
 */
export function useFavoriteRule(slug: string, ruleData: FavoriteItem) {
    // React Query Hooks 사용
    const { data: favorited, isLoading } = useIsFavorite(slug);
    const { toggle } = useToggleFavorite();
    const { mutate: addRecentView } = useAddRecentView();

    // 페이지 로드 시 최근 본 규칙에 추가
    useEffect(() => {
        // 컴포넌트 마운트 시 한 번만 실행되도록
        if (ruleData.slug === slug) {
            // RuleListItem과 FavoriteItem 간 타입 호환성 처리
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            addRecentView(ruleData as any);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, ruleData.slug, ruleData.title, addRecentView]);

    const toggleFavorite = () => {
        toggle(ruleData);
    };

    return {
        favorited: !!favorited, // undefined일 경우 false 처리
        isLoading,
        toggleFavorite
    };
}

/**
 * 규칙 삭제 훅
 */
export interface DeleteRuleParams {
    slug: string;
    title: string;
    author: string;
}

export function useDeleteRule(params: DeleteRuleParams) {
    const [deletePrUrl, setDeletePrUrl] = useState<string | null>(null);
    const deleteMutation = useDeleteRuleMutation();

    const isDeleting = deleteMutation.isPending;

    const deleteRule = async () => {
        if (!confirm('정말로 이 규칙을 삭제하시겠습니까? 삭제 요청 Pull Request가 생성됩니다.')) {
            return;
        }

        try {
            const result = await deleteMutation.mutateAsync({
                title: params.title,
                originalPath: `rules/${params.slug}.md`,
                author: params.author,
            });

            setDeletePrUrl(result.prUrl);
            alert('삭제 요청 PR이 성공적으로 생성되었습니다.');
        } catch (error) {
            console.error('Delete error:', error);
            alert('삭제 요청 중 오류가 발생했습니다.');
        }
    };

    return { isDeleting, deletePrUrl, deleteRule };
}

