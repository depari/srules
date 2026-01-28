/**
 * 배열 타입 LocalStorage 어댑터
 * IArrayStorage 인터페이스의 LocalStorage 구현체
 */

import { IArrayStorage } from '../interfaces/IStorage';
import { LocalStorageAdapter } from './LocalStorageAdapter';

export class ArrayStorageAdapter<T> implements IArrayStorage<T> {
    private storage: LocalStorageAdapter<T[]>;
    private key: string;

    constructor(key: string, prefix: string = 'srules') {
        this.storage = new LocalStorageAdapter<T[]>(prefix);
        this.key = key;
    }

    getAll(): T[] {
        return this.storage.get(this.key) || [];
    }

    add(item: T): void {
        const items = this.getAll();
        items.push(item);
        this.storage.set(this.key, items);
    }

    remove(predicate: (item: T) => boolean): boolean {
        const items = this.getAll();
        const initialLength = items.length;
        const filteredItems = items.filter(item => !predicate(item));

        if (filteredItems.length !== initialLength) {
            this.storage.set(this.key, filteredItems);
            return true;
        }

        return false;
    }

    exists(predicate: (item: T) => boolean): boolean {
        const items = this.getAll();
        return items.some(predicate);
    }

    setAll(items: T[]): void {
        this.storage.set(this.key, items);
    }

    clear(): void {
        this.storage.remove(this.key);
    }
}
