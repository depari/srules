'use client';

import { useState, useEffect } from 'react';
import { getTheme, setTheme, Theme } from '@/lib/storage';

export default function ThemeToggle() {
    const [theme, setInternalTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // 마운트 시 현재 테마 읽어서 동기화
        const currentTheme = getTheme();
        
        // 린트 에러(cascading renders) 방지를 위해 값이 다를 때만 업데이트
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInternalTheme(prev => {
            if (prev !== currentTheme) return currentTheme;
            return prev;
        });

        // html 클래스가 아직 설정 안 된 경우 보정 (SSR 안전장치)
        setTheme(currentTheme);
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
        setInternalTheme(newTheme);
        setTheme(newTheme);
    };

    // 마운트 전엔 placeholder (SSR hydration 불일치 방지)
    if (!mounted) {
        return (
            <div
                className="h-9 w-9 rounded-lg border border-slate-700 bg-slate-800/50"
                aria-hidden="true"
            />
        );
    }

    const isDark = theme === 'dark';

    return (
        <button
            id="theme-toggle-button"
            onClick={toggleTheme}
            className={`
                flex h-9 w-9 items-center justify-center rounded-lg border
                transition-all duration-200
                ${isDark
                    ? 'border-slate-700 bg-slate-800/50 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 hover:bg-slate-700/50'
                    : 'border-slate-300 bg-slate-100 text-slate-600 hover:text-amber-600 hover:border-amber-400/50 hover:bg-slate-200'
                }
            `}
            aria-label={isDark ? '라이트 테마로 전환' : '다크 테마로 전환'}
            title={isDark ? '라이트 테마로 전환' : '다크 테마로 전환'}
        >
            {isDark ? (
                // 다크 테마 상태: 태양 아이콘 (라이트로 전환 예고)
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 3v2m0 14v2M3 12H1m22 0h-2m-2.636-7.364-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l1.414 1.414M6.05 6.05 4.636 4.636M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />
                </svg>
            ) : (
                // 라이트 테마 상태: 달 아이콘 (다크로 전환 예고)
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}
