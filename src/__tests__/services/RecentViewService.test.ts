/**
 * RecentViewService 테스트
 */

import { RecentViewService } from '@/services/RecentViewService';
import { ArrayStorageAdapter } from '@/services/storage/ArrayStorageAdapter';
import type { RecentViewItem } from '@/services/RecentViewService';

describe('RecentViewService', () => {
    let service: RecentViewService;
    let mockStorage: ArrayStorageAdapter<RecentViewItem>;

    beforeEach(() => {
        localStorage.clear();
        mockStorage = new ArrayStorageAdapter<RecentViewItem>('test_recent', 'test');
        service = new RecentViewService(mockStorage, 10);
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('getRecentViews', () => {
        it('should return empty array when no recent views exist', () => {
            const views = service.getRecentViews();
            expect(views).toEqual([]);
        });

        it('should return all recent views', () => {
            service.addRecentView('slug-1', 'Title 1');
            service.addRecentView('slug-2', 'Title 2');

            const views = service.getRecentViews();
            expect(views).toHaveLength(2);
        });
    });

    describe('addRecentView', () => {
        it('should add new recent view', () => {
            service.addRecentView('test-slug', 'Test Title');

            const views = service.getRecentViews();
            expect(views).toHaveLength(1);
            expect(views[0].slug).toBe('test-slug');
            expect(views[0].title).toBe('Test Title');
            expect(views[0].viewedAt).toBeDefined();
        });

        it('should add recent view at the beginning of list', () => {
            service.addRecentView('slug-1', 'Title 1');
            service.addRecentView('slug-2', 'Title 2');

            const views = service.getRecentViews();
            expect(views[0].slug).toBe('slug-2'); // Most recent first
            expect(views[1].slug).toBe('slug-1');
        });

        it('should move existing item to top when viewed again', () => {
            service.addRecentView('slug-1', 'Title 1');
            service.addRecentView('slug-2', 'Title 2');
            service.addRecentView('slug-3', 'Title 3');

            // View slug-1 again
            service.addRecentView('slug-1', 'Title 1');

            const views = service.getRecentViews();
            expect(views).toHaveLength(3);
            expect(views[0].slug).toBe('slug-1'); // Moved to top
            expect(views[1].slug).toBe('slug-3');
            expect(views[2].slug).toBe('slug-2');
        });

        it('should limit items to maxItems', () => {
            const smallService = new RecentViewService(mockStorage, 3);

            smallService.addRecentView('slug-1', 'Title 1');
            smallService.addRecentView('slug-2', 'Title 2');
            smallService.addRecentView('slug-3', 'Title 3');
            smallService.addRecentView('slug-4', 'Title 4');

            const views = smallService.getRecentViews();
            expect(views).toHaveLength(3);
            expect(views[0].slug).toBe('slug-4');
            expect(views[1].slug).toBe('slug-3');
            expect(views[2].slug).toBe('slug-2');
            expect(views.find(v => v.slug === 'slug-1')).toBeUndefined();
        });

        it('should update viewedAt timestamp when re-adding', () => {
            service.addRecentView('test-slug', 'Test Title');
            const firstView = service.getRecentViews()[0];

            // Wait a bit
            jest.useFakeTimers();
            jest.advanceTimersByTime(1000);

            service.addRecentView('test-slug', 'Test Title');
            const secondView = service.getRecentViews()[0];

            expect(secondView.viewedAt).not.toBe(firstView.viewedAt);
            jest.useRealTimers();
        });
    });

    describe('removeRecentView', () => {
        beforeEach(() => {
            service.addRecentView('slug-1', 'Title 1');
            service.addRecentView('slug-2', 'Title 2');
            service.addRecentView('slug-3', 'Title 3');
        });

        it('should remove specific recent view', () => {
            const removed = service.removeRecentView('slug-2');

            expect(removed).toBe(true);

            const views = service.getRecentViews();
            expect(views).toHaveLength(2);
            expect(views.find(v => v.slug === 'slug-2')).toBeUndefined();
        });

        it('should return false when item does not exist', () => {
            const removed = service.removeRecentView('non-existent');

            expect(removed).toBe(false);
            expect(service.getRecentViews()).toHaveLength(3);
        });
    });

    describe('clearRecentViews', () => {
        it('should remove all recent views', () => {
            service.addRecentView('slug-1', 'Title 1');
            service.addRecentView('slug-2', 'Title 2');

            expect(service.getRecentViews()).toHaveLength(2);

            service.clearRecentViews();

            expect(service.getRecentViews()).toEqual([]);
        });

        it('should not throw error when clearing empty views', () => {
            expect(() => service.clearRecentViews()).not.toThrow();
        });
    });
});
