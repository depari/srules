'use client';

/**
 * LocalStorage를 이용한 사용자 데이터 저장 서비스
 * 
 * NOTE: 이 파일은 하위 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 직접 FavoriteService, RecentViewService를 사용하세요.
 */

import { getFavoriteService } from '@/services/FavoriteService';
import { getRecentViewService, RecentViewItem as ServiceRecentViewItem } from '@/services/RecentViewService';
import { LocalStorageAdapter } from '@/services/storage/LocalStorageAdapter';
import type { FavoriteItem as TypeFavoriteItem } from '@/types/rule';

const STORAGE_KEYS = {
    FAVORITES: 'favorites',
    RECENT_VIEWS: 'recent_views',
    GITHUB_TOKEN: 'github_token',
    THEME: 'theme',
};

// Re-export types for backward compatibility
export type FavoriteItem = TypeFavoriteItem;
export type RecentViewItem = ServiceRecentViewItem;

// 서비스 인스턴스
const favoriteService = getFavoriteService();
const recentViewService = getRecentViewService();
const tokenStorage = new LocalStorageAdapter<string>('srules');
const themeStorage = new LocalStorageAdapter<string>('');

/**
 * 즐겨찾기 목록 조회
 * @deprecated Use getFavoriteService().getFavorites() instead
 */
export const getFavorites = (): FavoriteItem[] => {
    return favoriteService.getFavorites();
};

/**
 * 즐겨찾기 토글 (추가/삭제)
 * @deprecated Use getFavoriteService().toggleFavorite() instead
 */
export const toggleFavorite = (item: FavoriteItem): boolean => {
    return favoriteService.toggleFavorite(item);
};

/**
 * 즐겨찾기 여부 확인
 * @deprecated Use getFavoriteService().isFavorite() instead
 */
export const isFavorite = (slug: string): boolean => {
    return favoriteService.isFavorite(slug);
};

/**
 * 최근 본 규칙 목록 조회
 * @deprecated Use getRecentViewService().getRecentViews() instead
 */
export const getRecentViews = (): RecentViewItem[] => {
    return recentViewService.getRecentViews();
};

/**
 * 최근 본 규칙 추가 (최대 10개)
 * @deprecated Use getRecentViewService().addRecentView() instead
 */
export const addRecentView = (slug: string, title: string): void => {
    recentViewService.addRecentView(slug, title);
};

/**
 * GitHub Token 관리
 */
export const getStoredToken = (): string | null => {
    return tokenStorage.get(STORAGE_KEYS.GITHUB_TOKEN);
};

export const setStoredToken = (token: string): void => {
    tokenStorage.set(STORAGE_KEYS.GITHUB_TOKEN, token);
};

export const removeStoredToken = (): void => {
    tokenStorage.remove(STORAGE_KEYS.GITHUB_TOKEN);
};

// 테마 관리
export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'srules-theme';
const VALID_THEMES: Theme[] = ['dark', 'light'];

export const getTheme = (): Theme => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && VALID_THEMES.includes(stored as Theme)) {
        return stored as Theme;
    }
    return 'dark'; // 기본값: 다크 테마
};

export const setTheme = (theme: Theme): void => {
    if (typeof window === 'undefined') return;
    // localStorage에 저장 (key 직접 사용으로 일관성 보장)
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    // HTML 루트 클래스를 테마 클래스로 완전 교체
    // globals.css의 html.dark / html.light 셀렉터와 매칭
    document.documentElement.className = theme;
};

