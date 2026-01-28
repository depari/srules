/**
 * LocalStorage 어댑터
 * IStorage 인터페이스의 LocalStorage 구현체
 */

import { IStorage } from '../interfaces/IStorage';

export class LocalStorageAdapter<T> implements IStorage<T> {
    private prefix: string;

    constructor(prefix: string = 'srules') {
        this.prefix = prefix;
    }

    private getFullKey(key: string): string {
        return `${this.prefix}_${key}`;
    }

    get(key: string): T | null {
        if (typeof window === 'undefined') return null;

        try {
            const stored = localStorage.getItem(this.getFullKey(key));
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error(`Failed to get item from localStorage: ${key}`, error);
            return null;
        }
    }

    set(key: string, value: T): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(this.getFullKey(key), JSON.stringify(value));
        } catch (error) {
            console.error(`Failed to set item in localStorage: ${key}`, error);
        }
    }

    remove(key: string): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.removeItem(this.getFullKey(key));
        } catch (error) {
            console.error(`Failed to remove item from localStorage: ${key}`, error);
        }
    }

    getAllKeys(): string[] {
        if (typeof window === 'undefined') return [];

        const keys: string[] = [];
        const prefixWithUnderscore = `${this.prefix}_`;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefixWithUnderscore)) {
                keys.push(key.substring(prefixWithUnderscore.length));
            }
        }

        return keys;
    }
}
