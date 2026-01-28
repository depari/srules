/**
 * Rule Actions 커스텀 훅
 * 각 액션의 비즈니스 로직을 독립적인 훅으로 분리
 */

import { useState, useEffect } from 'react';
import { getFavoriteService } from '@/services/FavoriteService';
import { getRecentViewService } from '@/services/RecentViewService';
import type { FavoriteItem } from '@/types/rule';

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

    const share = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
    };

    return { sharesCopied, share };
}

/**
 * 즐겨찾기 훅
 */
export function useFavoriteRule(slug: string, ruleData: FavoriteItem) {
    const [favorited, setFavorited] = useState(false);
    const favoriteService = getFavoriteService();

    useEffect(() => {
        setFavorited(favoriteService.isFavorite(slug));
    }, [slug, favoriteService]);

    // 페이지 로드 시 최근 본 규칙에 추가
    useEffect(() => {
        const recentViewService = getRecentViewService();
        recentViewService.addRecentView(slug, ruleData.title);
    }, [slug, ruleData.title]);

    const toggleFavorite = () => {
        const isAdded = favoriteService.toggleFavorite(ruleData);
        setFavorited(isAdded);
        window.dispatchEvent(new CustomEvent('favorites-updated'));
    };

    return { favorited, toggleFavorite };
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletePrUrl, setDeletePrUrl] = useState<string | null>(null);

    const deleteRule = async (onDeleteAction: (params: DeleteRuleParams) => Promise<string>) => {
        if (!confirm('정말로 이 규칙을 삭제하시겠습니까? 삭제 요청 Pull Request가 생성됩니다.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const prUrl = await onDeleteAction(params);
            setDeletePrUrl(prUrl);
            alert('삭제 요청 PR이 성공적으로 생성되었습니다.');
        } catch (error) {
            console.error('Delete error:', error);
            alert('삭제 요청 중 오류가 발생했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    return { isDeleting, deletePrUrl, deleteRule };
}
