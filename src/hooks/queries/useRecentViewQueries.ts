/**
 * 최근 본 규칙 React Query 훅
 * LocalStorage 기반 상태를 React Query로 캐싱 및 최적화
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RecentViewService } from '@/services/RecentViewService';
import type { RuleListItem } from '@/types/rule';

// 최근 본 규칙 서비스 인스턴스
const recentViewService = new RecentViewService();

// Query Keys
export const recentViewKeys = {
    all: ['recentViews'] as const,
    list: () => [...recentViewKeys.all, 'list'] as const,
};

/**
 * 최근 본 규칙 목록 조회 훅
 */
export function useRecentViews(limit?: number) {
    return useQuery({
        queryKey: [...recentViewKeys.list(), limit],
        queryFn: () => {
            const items = recentViewService.getRecentViews();
            return limit ? items.slice(0, limit) : items;
        },
        staleTime: Infinity, // LocalStorage 데이터이므로 항상 최신
    });
}

/**
 * 최근 본 규칙 추가 훅
 */
export function useAddRecentView() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (rule: RuleListItem) => {
            // 서비스 메서드 시그니처에 맞춰 호출 (slug, title)
            recentViewService.addRecentView(rule.slug, rule.title);
            return Promise.resolve(rule);
        },
        onSuccess: () => {
            // 목록 무효화 및 재조회
            queryClient.invalidateQueries({ queryKey: recentViewKeys.list() });
        },
    });
}

/**
 * 최근 본 규칙 전체 삭제 훅
 */
export function useClearRecentViews() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => {
            recentViewService.clearRecentViews();
            return Promise.resolve();
        },
        onSuccess: () => {
            // 캐시 업데이트
            queryClient.setQueryData(recentViewKeys.list(), []);
        },
    });
}
