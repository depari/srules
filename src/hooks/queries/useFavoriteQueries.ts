/**
 * 즐겨찾기 React Query 훅
 * LocalStorage 기반 상태를 React Query로 캐싱 및 최적화
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FavoriteService } from '@/services/FavoriteService';
import type { FavoriteItem } from '@/types/rule';

// 즐겨찾기 서비스 인스턴스 ("new LocalStorageAdapter()" 인자 제거)
const favoriteService = new FavoriteService();

// Query Keys
export const favoriteKeys = {
    all: ['favorites'] as const,
    list: () => [...favoriteKeys.all, 'list'] as const,
    isFavorite: (slug: string) => [...favoriteKeys.all, 'isFavorite', slug] as const,
};

/**
 * 즐겨찾기 목록 조회 훅
 */
export function useFavorites() {
    return useQuery({
        queryKey: favoriteKeys.list(),
        queryFn: () => favoriteService.getFavorites(),
        staleTime: Infinity, // LocalStorage 데이터이므로 항상 최신
    });
}

/**
 * 특정 규칙의 즐겨찾기 여부 조회 훅
 */
export function useIsFavorite(slug: string) {
    return useQuery({
        queryKey: favoriteKeys.isFavorite(slug),
        queryFn: () => favoriteService.isFavorite(slug),
        staleTime: Infinity,
    });
}

/**
 * 즐겨찾기 추가 훅
 */
export function useAddFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (item: FavoriteItem) => {
            favoriteService.addFavorite(item);
            return Promise.resolve(item);
        },
        onSuccess: (item) => {
            // 목록 무효화 및 재조회
            queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
            // 특정 항목 상태 업데이트
            queryClient.setQueryData(favoriteKeys.isFavorite(item.slug), true);
        },
    });
}

/**
 * 즐겨찾기 제거 훅
 */
export function useRemoveFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug: string) => {
            favoriteService.removeFavorite(slug);
            return Promise.resolve(slug);
        },
        onSuccess: (slug) => {
            // 목록 무효화 및 재조회
            queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
            // 특정 항목 상태 업데이트
            queryClient.setQueryData(favoriteKeys.isFavorite(slug), false);
        },
    });
}

/**
 * 즐겨찾기 토글 훅 (추가/제거 통합)
 */
export function useToggleFavorite() {
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();

    return {
        toggle: (item: FavoriteItem) => {
            const isFavorite = favoriteService.isFavorite(item.slug);

            if (isFavorite) {
                removeFavorite.mutate(item.slug);
            } else {
                addFavorite.mutate(item);
            }
        },
        isLoading: addFavorite.isPending || removeFavorite.isPending,
    };
}
