/**
 * FavoriteService 테스트
 */

import { FavoriteService } from '@/services/FavoriteService';
import { ArrayStorageAdapter } from '@/services/storage/ArrayStorageAdapter';
import { FavoriteItem } from '@/types/rule';

describe('FavoriteService', () => {
    let service: FavoriteService;
    let mockStorage: ArrayStorageAdapter<FavoriteItem>;

    const createTestItem = (id: number): FavoriteItem => ({
        slug: `test-slug-${id}`,
        title: `Test Title ${id}`,
        excerpt: `Test excerpt ${id}`,
        author: `Author ${id}`,
        created: '2026-01-01',
        difficulty: 'beginner',
        category: ['TypeScript'],
        tags: ['test'],
    });

    beforeEach(() => {
        localStorage.clear();
        mockStorage = new ArrayStorageAdapter<FavoriteItem>('test_favorites', 'test');
        service = new FavoriteService(mockStorage);
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('getFavorites', () => {
        it('should return empty array when no favorites exist', () => {
            const favorites = service.getFavorites();
            expect(favorites).toEqual([]);
        });

        it('should return all favorites', () => {
            const item1 = createTestItem(1);
            const item2 = createTestItem(2);

            service.toggleFavorite(item1);
            service.toggleFavorite(item2);

            const favorites = service.getFavorites();
            expect(favorites).toHaveLength(2);
            expect(favorites).toContainEqual(item1);
            expect(favorites).toContainEqual(item2);
        });
    });

    describe('toggleFavorite', () => {
        it('should add item when not exists', () => {
            const item = createTestItem(1);
            const isAdded = service.toggleFavorite(item);

            expect(isAdded).toBe(true);
            expect(service.getFavorites()).toHaveLength(1);
            expect(service.isFavorite(item.slug)).toBe(true);
        });

        it('should remove item when exists', () => {
            const item = createTestItem(1);

            service.toggleFavorite(item); // Add
            const isRemoved = service.toggleFavorite(item); // Remove

            expect(isRemoved).toBe(false);
            expect(service.getFavorites()).toHaveLength(0);
            expect(service.isFavorite(item.slug)).toBe(false);
        });

        it('should toggle multiple times correctly', () => {
            const item = createTestItem(1);

            expect(service.toggleFavorite(item)).toBe(true);  // Add
            expect(service.toggleFavorite(item)).toBe(false); // Remove
            expect(service.toggleFavorite(item)).toBe(true);  // Add again

            expect(service.getFavorites()).toHaveLength(1);
        });
    });

    describe('isFavorite', () => {
        it('should return false when item is not favorited', () => {
            expect(service.isFavorite('non-existent-slug')).toBe(false);
        });

        it('should return true when item is favorited', () => {
            const item = createTestItem(1);
            service.toggleFavorite(item);

            expect(service.isFavorite(item.slug)).toBe(true);
        });

        it('should return false after item is removed', () => {
            const item = createTestItem(1);

            service.toggleFavorite(item); // Add
            service.toggleFavorite(item); // Remove

            expect(service.isFavorite(item.slug)).toBe(false);
        });
    });

    describe('clearFavorites', () => {
        it('should remove all favorites', () => {
            service.toggleFavorite(createTestItem(1));
            service.toggleFavorite(createTestItem(2));
            service.toggleFavorite(createTestItem(3));

            expect(service.getFavorites()).toHaveLength(3);

            service.clearFavorites();

            expect(service.getFavorites()).toEqual([]);
        });

        it('should not throw error when clearing empty favorites', () => {
            expect(() => service.clearFavorites()).not.toThrow();
        });
    });
});
