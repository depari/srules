/**
 * 최근 본 규칙 서비스
 * 스토리지 추상화를 통한 최근 조회 기록 관리
 */

import { ArrayStorageAdapter } from './storage/ArrayStorageAdapter';

export interface RecentViewItem {
    slug: string;
    title: string;
    viewedAt: string;
}

export class RecentViewService {
    private storage: ArrayStorageAdapter<RecentViewItem>;
    private maxItems: number;

    constructor(storage?: ArrayStorageAdapter<RecentViewItem>, maxItems: number = 10) {
        this.storage = storage || new ArrayStorageAdapter<RecentViewItem>('recent_views', 'srules');
        this.maxItems = maxItems;
    }

    /**
     * 모든 최근 본 규칙 목록 조회
     */
    getRecentViews(): RecentViewItem[] {
        return this.storage.getAll();
    }

    /**
     * 최근 본 규칙 추가
     * 이미 존재하면 제거 후 최신 항목으로 추가 (최대 개수 제한)
     */
    addRecentView(slug: string, title: string): void {
        let items = this.storage.getAll();

        // 이미 있으면 제거 (최신화)
        items = items.filter(v => v.slug !== slug);

        // 앞에 추가
        items.unshift({
            slug,
            title,
            viewedAt: new Date().toISOString(),
        });

        // 최대 개수 유지
        if (items.length > this.maxItems) {
            items = items.slice(0, this.maxItems);
        }

        this.storage.setAll(items);
    }

    /**
     * 특정 규칙 제거
     */
    removeRecentView(slug: string): boolean {
        return this.storage.remove(v => v.slug === slug);
    }

    /**
     * 모든 최근 본 규칙 삭제
     */
    clearRecentViews(): void {
        this.storage.clear();
    }
}

// 싱글톤 인스턴스
let recentViewServiceInstance: RecentViewService | null = null;

/**
 * RecentViewService 싱글톤 인스턴스 반환
 */
export function getRecentViewService(): RecentViewService {
    if (!recentViewServiceInstance) {
        recentViewServiceInstance = new RecentViewService();
    }
    return recentViewServiceInstance;
}
