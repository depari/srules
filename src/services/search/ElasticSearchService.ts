/**
 * ElasticSearch 서비스 구현체
 * 실제 Elasticsearch 클러스터와 통신
 * 주의: 이 서비스는 서버 사이드 렌더링(SSR) 또는 API 라우트가 가능한 환경에서만 작동합니다.
 * GitHub Pages 같은 정적 호스팅에서는 작동하지 않을 수 있습니다.
 */

import { ISearchService, SearchOptions, SearchResult } from '@/services/interfaces/ISearchService';
import { SearchIndexItem } from '@/types/rule';

export class ElasticSearchService implements ISearchService {
    private endpoint: string;
    private apiKey: string;
    private indexName: string;

    constructor() {
        this.endpoint = process.env.NEXT_PUBLIC_ES_ENDPOINT || '';
        this.apiKey = process.env.NEXT_PUBLIC_ES_API_KEY || '';
        this.indexName = process.env.NEXT_PUBLIC_ES_INDEX || 'srules-search';
    }

    async initialize(): Promise<void> {
        // Elasticsearch 연결 확인 또는 인덱스 매핑 설정
        // 클라이언트 사이드에서는 보안상 API Key 노출 주의 (프록시 권장)
        if (!this.endpoint) {
            console.warn('ElasticSearch endpoint not configured');
        }
    }

    async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
        if (!this.endpoint) return [];

        try {
            const response = await fetch(`${this.endpoint}/${this.indexName}/_search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `ApiKey ${this.apiKey}`
                },
                body: JSON.stringify({
                    size: options?.limit || 10,
                    query: {
                        multi_match: {
                            query: query,
                            fields: ['title^3', 'tags^2', 'category^1.5', 'content', 'author'],
                            fuzziness: 'AUTO'
                        }
                    },
                    highlight: {
                        fields: {
                            content: {},
                            title: {}
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`ES Search failed: ${response.statusText}`);
            }

            const data = await response.json();

            // ES 응답을 SearchResult로 변환
            return data.hits.hits.map((hit: any) => ({
                item: {
                    slug: hit._source.slug,
                    title: hit._source.title,
                    excerpt: hit._source.excerpt || hit.highlight?.content?.[0] || '',
                    category: hit._source.category,
                    tags: hit._source.tags,
                    author: hit._source.author,
                    // ES에는 content 전체가 있을 수 있음
                } as SearchIndexItem,
                score: hit._score,
                matches: Object.keys(hit.highlight || {}).map(key => ({
                    key,
                    value: hit.highlight[key][0],
                    indices: [] // ES 하이라이트는 HTML 태그(<em>)로 오므로 인덱스 계산 복잡 (생략)
                }))
            }));

        } catch (error) {
            console.error('ElasticSearch query error:', error);
            return [];
        }
    }
}
