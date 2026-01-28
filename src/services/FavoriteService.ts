/**
 * 즐겨찾기 서비스
 * 스토리지 추상화를 통한 즐겨찾기 관리
 */

import { ArrayStorageAdapter } from './storage/ArrayStorageAdapter';
import { FavoriteItem } from '@/types/rule';

export class FavoriteService {
    private storage: ArrayStorageAdapter<FavoriteItem>;

    constructor(storage?: ArrayStorageAdapter<FavoriteItem>) {
        this.storage = storage || new ArrayStorageAdapter<FavoriteItem>('favorites', 'srules');
    }

    /**
     * 모든 즐겨찾기 목록 조회
     */
    getFavorites(): FavoriteItem[] {
        return this.storage.getAll();
    }

    /**
     * 즐겨찾기 토글 (추가/삭제)
     * @returns true if added, false if removed
     */
    toggleFavorite(item: FavoriteItem): boolean {
        const exists = this.storage.exists(f => f.slug === item.slug);

        if (exists) {
            this.storage.remove(f => f.slug === item.slug);
            return false;
        } else {
            this.storage.add(item);
            return true;
        }
    }

    /**
     * 즐겨찾기 여부 확인
     */
    isFavorite(slug: string): boolean {
        return this.storage.exists(f => f.slug === slug);
    }

    /**
     * 모든 즐겨찾기 삭제
     */
    clearFavorites(): void {
        this.storage.clear();
    }
}

// 싱글톤 인스턴스
let favoriteServiceInstance: FavoriteService | null = null;

/**
 * FavoriteService 싱글톤 인스턴스 반환
 */
export function getFavoriteService(): FavoriteService {
    if (!favoriteServiceInstance) {
        favoriteServiceInstance = new FavoriteService();
    }
    return favoriteServiceInstance;
}
