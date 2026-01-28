/**
 * 검색 서비스 인터페이스
 * DIP 적용: 검색 엔진 구현체(Fuse.js, Elasticsearch 등)와 비즈니스 로직 분리
 */

import { SearchIndexItem } from '@/types/rule';

export interface SearchResult {
    item: SearchIndexItem;
    score?: number;
    matches?: {
        key?: string;
        value?: string;
        indices?: [number, number][];
    }[];
}

export interface SearchOptions {
    limit?: number;
    threshold?: number; // 유사도 임계값 (0.0 ~ 1.0)
    keys?: string[];    // 검색 대상 필드
}

export interface ISearchService {
    /**
     * 검색 인덱스 초기화/로드
     */
    initialize(): Promise<void>;

    /**
     * 검색 실행
     */
    search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}
