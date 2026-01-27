'use client';

/**
 * LocalStorage를 이용한 사용자 데이터 저장 서비스
 */

const STORAGE_KEYS = {
    FAVORITES: 'srules_favorites',
    RECENT_VIEWS: 'srules_recent_views',
    THEME: 'srules_theme',
};

export type FavoriteItem = {
    slug: string;
    title: string;
    excerpt?: string;
    author?: string;
    created: string;
    difficulty?: string;
    category: string[];
    tags: string[];
};

export type RecentViewItem = {
    slug: string;
    title: string;
    viewedAt: string;
};

/**
 * 즐겨찾기 목록 조회
 */
export const getFavorites = (): FavoriteItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
};

/**
 * 즐겨찾기 토글 (추가/삭제)
 */
export const toggleFavorite = (item: FavoriteItem): boolean => {
    const favorites = getFavorites();
    const index = favorites.findIndex((f) => f.slug === item.slug);

    let isAdded = false;
    if (index === -1) {
        favorites.push(item);
        isAdded = true;
    } else {
        favorites.splice(index, 1);
        isAdded = false;
    }

    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return isAdded;
};

/**
 * 즐겨찾기 여부 확인
 */
export const isFavorite = (slug: string): boolean => {
    const favorites = getFavorites();
    return favorites.some((f) => f.slug === slug);
};

/**
 * 최근 본 규칙 목록 조회
 */
export const getRecentViews = (): RecentViewItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_VIEWS);
    return stored ? JSON.parse(stored) : [];
};

/**
 * 최근 본 규칙 추가 (최대 10개)
 */
export const addRecentView = (slug: string, title: string): void => {
    if (typeof window === 'undefined') return;

    let recentViews = getRecentViews();

    // 이미 있으면 제거 (최신화)
    recentViews = recentViews.filter((v) => v.slug !== slug);

    // 앞에 추가
    recentViews.unshift({
        slug,
        title,
        viewedAt: new Date().toISOString(),
    });

    // 최대 10개 유지
    if (recentViews.length > 10) {
        recentViews = recentViews.slice(0, 10);
    }

    localStorage.setItem(STORAGE_KEYS.RECENT_VIEWS, JSON.stringify(recentViews));
};

// 테마 관리
export type Theme = 'dark' | 'light';

export const getTheme = (): Theme => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('srules-theme') as Theme) || 'dark';
};

export const setTheme = (theme: Theme): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('srules-theme', theme);
    // HTML 태그에 클래스 적용
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};
