/**
 * LocalStorageAdapter 테스트
 */

import { LocalStorageAdapter } from '@/services/storage/LocalStorageAdapter';

describe('LocalStorageAdapter', () => {
    let adapter: LocalStorageAdapter<any>;

    beforeEach(() => {
        // LocalStorage mock 초기화
        localStorage.clear();
        adapter = new LocalStorageAdapter('test');
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('get', () => {
        it('should return null when key does not exist', () => {
            const result = adapter.get('nonexistent');
            expect(result).toBeNull();
        });

        it('should return stored value', () => {
            const testData = { name: 'Test', value: 123 };
            localStorage.setItem('test_mykey', JSON.stringify(testData));

            const result = adapter.get('mykey');
            expect(result).toEqual(testData);
        });

        it('should handle JSON parse errors gracefully', () => {
            localStorage.setItem('test_badkey', 'invalid json');

            const result = adapter.get('badkey');
            expect(result).toBeNull();
        });
    });

    describe('set', () => {
        it('should store value with prefix', () => {
            const testData = { name: 'Test', value: 123 };
            adapter.set('mykey', testData);

            const stored = localStorage.getItem('test_mykey');
            expect(stored).toBe(JSON.stringify(testData));
        });

        it('should overwrite existing value', () => {
            adapter.set('mykey', { value: 1 });
            adapter.set('mykey', { value: 2 });

            const result = adapter.get('mykey');
            expect(result).toEqual({ value: 2 });
        });
    });

    describe('remove', () => {
        it('should remove stored value', () => {
            adapter.set('mykey', { value: 123 });
            adapter.remove('mykey');

            const result = adapter.get('mykey');
            expect(result).toBeNull();
        });

        it('should not throw error when removing non-existent key', () => {
            expect(() => adapter.remove('nonexistent')).not.toThrow();
        });
    });

    describe('getAllKeys', () => {
        it('should return empty array when no keys exist', () => {
            const keys = adapter.getAllKeys();
            expect(keys).toEqual([]);
        });

        it('should return all keys with matching prefix', () => {
            adapter.set('key1', 'value1');
            adapter.set('key2', 'value2');
            adapter.set('key3', 'value3');

            const keys = adapter.getAllKeys();
            expect(keys).toHaveLength(3);
            expect(keys).toContain('key1');
            expect(keys).toContain('key2');
            expect(keys).toContain('key3');
        });

        it('should not return keys with different prefix', () => {
            adapter.set('key1', 'value1');
            localStorage.setItem('other_key', 'value');

            const keys = adapter.getAllKeys();
            expect(keys).toEqual(['key1']);
        });
    });

    describe('custom prefix', () => {
        it('should use custom prefix', () => {
            const customAdapter = new LocalStorageAdapter<string>('custom');
            customAdapter.set('mykey', 'myvalue');

            const stored = localStorage.getItem('custom_mykey');
            expect(stored).toBe('"myvalue"');
        });
    });
});
