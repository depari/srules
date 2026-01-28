/**
 * ArrayStorageAdapter 테스트
 */

import { ArrayStorageAdapter } from '@/services/storage/ArrayStorageAdapter';

interface TestItem {
    id: number;
    name: string;
}

describe('ArrayStorageAdapter', () => {
    let adapter: ArrayStorageAdapter<TestItem>;

    beforeEach(() => {
        localStorage.clear();
        adapter = new ArrayStorageAdapter<TestItem>('items', 'test');
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('getAll', () => {
        it('should return empty array when no items exist', () => {
            const items = adapter.getAll();
            expect(items).toEqual([]);
        });

        it('should return all stored items', () => {
            const testItems: TestItem[] = [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
            ];

            adapter.setAll(testItems);
            const items = adapter.getAll();

            expect(items).toEqual(testItems);
        });
    });

    describe('add', () => {
        it('should add item to empty list', () => {
            const newItem: TestItem = { id: 1, name: 'New Item' };
            adapter.add(newItem);

            const items = adapter.getAll();
            expect(items).toHaveLength(1);
            expect(items[0]).toEqual(newItem);
        });

        it('should add item to existing list', () => {
            adapter.setAll([{ id: 1, name: 'Item 1' }]);
            adapter.add({ id: 2, name: 'Item 2' });

            const items = adapter.getAll();
            expect(items).toHaveLength(2);
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            adapter.setAll([
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
                { id: 3, name: 'Item 3' },
            ]);
        });

        it('should remove item matching predicate', () => {
            const removed = adapter.remove(item => item.id === 2);

            expect(removed).toBe(true);

            const items = adapter.getAll();
            expect(items).toHaveLength(2);
            expect(items.find(item => item.id === 2)).toBeUndefined();
        });

        it('should return false when no item matches', () => {
            const removed = adapter.remove(item => item.id === 999);

            expect(removed).toBe(false);
            expect(adapter.getAll()).toHaveLength(3);
        });

        it('should remove all matching items', () => {
            adapter.add({ id: 1, name: 'Duplicate' });

            const removed = adapter.remove(item => item.id === 1);

            expect(removed).toBe(true);
            const items = adapter.getAll();
            expect(items.every(item => item.id !== 1)).toBe(true);
        });
    });

    describe('exists', () => {
        beforeEach(() => {
            adapter.setAll([
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
            ]);
        });

        it('should return true when item exists', () => {
            const exists = adapter.exists(item => item.id === 1);
            expect(exists).toBe(true);
        });

        it('should return false when item does not exist', () => {
            const exists = adapter.exists(item => item.id === 999);
            expect(exists).toBe(false);
        });

        it('should work with complex predicates', () => {
            const exists = adapter.exists(item => item.name.includes('Item'));
            expect(exists).toBe(true);
        });
    });

    describe('setAll', () => {
        it('should replace all items', () => {
            adapter.setAll([{ id: 1, name: 'Item 1' }]);
            adapter.setAll([{ id: 2, name: 'Item 2' }, { id: 3, name: 'Item 3' }]);

            const items = adapter.getAll();
            expect(items).toHaveLength(2);
            expect(items[0].id).toBe(2);
        });

        it('should clear items when setting empty array', () => {
            adapter.setAll([{ id: 1, name: 'Item 1' }]);
            adapter.setAll([]);

            const items = adapter.getAll();
            expect(items).toEqual([]);
        });
    });

    describe('clear', () => {
        it('should remove all items', () => {
            adapter.setAll([
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
            ]);

            adapter.clear();

            const items = adapter.getAll();
            expect(items).toEqual([]);
        });

        it('should not throw error when clearing empty storage', () => {
            expect(() => adapter.clear()).not.toThrow();
        });
    });
});
