/**
 * 검색 관련 React Query Hooks
 * Search Index 로딩 및 캐싱 최적화
 */

import { useQuery } from '@tanstack/react-query';
import type { SearchIndexItem } from '@/types/rule';

// Query Keys
export const searchKeys = {
    all: ['search'] as const,
    index: () => [...searchKeys.all, 'index'] as const,
};

/**
 * 검색 인덱스 데이터를 로드하는 훅
 */
export function useSearchIndex() {
    return useQuery({
        queryKey: searchKeys.index(),
        queryFn: async () => {
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
            const res = await fetch(`${basePath}/search-index.json`);
            if (!res.ok) {
                throw new Error('Failed to load search index');
            }
            return res.json() as Promise<SearchIndexItem[]>;
        },
        staleTime: 10 * 60 * 1000, // 10분간 유효 (정적 파일이므로 길게 설정)
        refetchOnWindowFocus: false, // 포커스 시 재요청 방지
        refetchOnMount: false, // 마운트 시 재요청 방지
    });
}
