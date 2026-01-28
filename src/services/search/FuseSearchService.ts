/**
 * Fuse.js 기반 검색 서비스 구현체
 * 클라이언트 사이드 검색 엔진
 */

import Fuse from 'fuse.js';
import { ISearchService, SearchOptions, SearchResult } from '@/services/interfaces/ISearchService';
import { SearchIndexItem } from '@/types/rule';

export class FuseSearchService implements ISearchService {
    private fuse: Fuse<SearchIndexItem> | null = null;
    private indexData: SearchIndexItem[] = [];

    constructor(initialData?: SearchIndexItem[]) {
        if (initialData) {
            this.indexData = initialData;
            this.initFuse();
        }
    }

    private initFuse() {
        this.fuse = new Fuse(this.indexData, {
            keys: [
                { name: 'title', weight: 2 },
                { name: 'tags', weight: 1.5 },
                { name: 'category', weight: 1.5 },
                { name: 'excerpt', weight: 1 },
                { name: 'author', weight: 0.5 },
                { name: 'content', weight: 0.1 } // 본문 검색 추가 (인덱스에 포함되어 있다면)
            ],
            threshold: 0.4,
            includeScore: true,
            includeMatches: true, // 하이라이팅을 위한 매치 정보 포함
            minMatchCharLength: 2,
            ignoreLocation: true,
        });
    }

    async initialize(): Promise<void> {
        if (this.indexData.length > 0) return;

        try {
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
            const res = await fetch(`${basePath}/search-index.json`);
            if (!res.ok) throw new Error('Failed to load search index');

            this.indexData = await res.json();
            this.initFuse();
        } catch (error) {
            console.error('FuseSearchService initialization failed:', error);
            throw error;
        }
    }

    async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
        if (!this.fuse) {
            await this.initialize();
        }

        if (!query.trim() || !this.fuse) {
            return [];
        }

        const fuseResults = this.fuse.search(query);
        const limit = options?.limit || 10;

        // Fuse 결과를 ISearchResult 형태로 변환
        return fuseResults.slice(0, limit).map(result => ({
            item: result.item,
            score: result.score,
            matches: result.matches?.map(match => ({
                key: match.key,
                value: match.value,
                indices: match.indices as [number, number][]
            }))
        }));
    }
}
