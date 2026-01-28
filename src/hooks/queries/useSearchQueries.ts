/**
 * 검색 관련 React Query Hooks
 * Search Service 통합 및 검색 결과 캐싱
 */

import { useQuery } from '@tanstack/react-query';
import { FuseSearchService } from '@/services/search/FuseSearchService';
import { ElasticSearchService } from '@/services/search/ElasticSearchService';
import type { ISearchService, SearchOptions } from '@/services/interfaces/ISearchService';
import type { SearchIndexItem } from '@/types/rule';

// Query Keys
export const searchKeys = {
    all: ['search'] as const,
    index: () => [...searchKeys.all, 'index'] as const,
    query: (query: string, options?: SearchOptions) => [...searchKeys.all, 'query', query, options] as const,
};

// 싱글톤 서비스 인스턴스
let searchServiceInstance: ISearchService | null = null;

function getSearchService(): ISearchService {
    if (searchServiceInstance) return searchServiceInstance;

    const provider = process.env.NEXT_PUBLIC_SEARCH_PROVIDER;
    if (provider === 'elasticsearch') {
        searchServiceInstance = new ElasticSearchService();
    } else {
        searchServiceInstance = new FuseSearchService();
    }
    return searchServiceInstance;
}

/**
 * 검색 실행 훅
 * 검색어 변경 시 자동으로 검색 실행 및 캐싱
 */
export function useSearch(query: string, options?: SearchOptions) {
    const service = getSearchService();

    return useQuery({
        queryKey: searchKeys.query(query, options),
        queryFn: async () => {
            if (!query.trim()) return [];
            await service.initialize();
            return service.search(query, options);
        },
        enabled: !!query.trim(),
        staleTime: 60 * 1000, // 검색 결과 1분간 캐시
        placeholderData: (previousData) => previousData, // 검색어 입력 중 깜빡임 방지
    });
}

/**
 * 검색 인덱스 데이터 로드 훅 (Legacy Support or Direct Access)
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
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
}
