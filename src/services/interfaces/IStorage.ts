/**
 * 스토리지 인터페이스
 * LocalStorage, SessionStorage, IndexedDB 등 다양한 구현체 지원
 */

export interface IStorage<T> {
    /**
     * 특정 키의 데이터 조회
     */
    get(key: string): T | null;

    /**
     * 데이터 저장
     */
    set(key: string, value: T): void;

    /**
     * 데이터 삭제
     */
    remove(key: string): void;

    /**
     * 모든 키 목록 조회
     */
    getAllKeys(): string[];
}

/**
 * 배열 타입 스토리지 인터페이스
 * 목록 관리에 특화된 인터페이스
 */
export interface IArrayStorage<T> {
    /**
     * 전체 목록 조회
     */
    getAll(): T[];

    /**
     * 항목 추가
     */
    add(item: T): void;

    /**
     * 항목 제거
     */
    remove(predicate: (item: T) => boolean): boolean;

    /**
     * 항목 존재 여부 확인
     */
    exists(predicate: (item: T) => boolean): boolean;

    /**
     * 전체 목록 설정
     */
    setAll(items: T[]): void;

    /**
     * 전체 삭제
     */
    clear(): void;
}
