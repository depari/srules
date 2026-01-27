'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getFavorites } from '@/lib/storage';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    const t = useTranslations('common');
    const pathname = usePathname();
    const [favoriteCount, setFavoriteCount] = useState(0);

    // 즐겨찾기 개수 업데이트 로직
    const updateFavoriteCount = () => {
        setFavoriteCount(getFavorites().length);
    };

    useEffect(() => {
        updateFavoriteCount();

        // 즐겨찾기 토글 시 발생하는 스토리지 이벤트를 감지 (커스텀 이벤트 추천)
        // 여기서는 간단히 페이지가 활성화될 때마다 업데이트
        window.addEventListener('focus', updateFavoriteCount);

        // 커스텀 이벤트 리스너 (RuleActions에서 발생시킬 수 있음)
        window.addEventListener('favorites-updated', updateFavoriteCount);

        return () => {
            window.removeEventListener('focus', updateFavoriteCount);
            window.removeEventListener('favorites-updated', updateFavoriteCount);
        };
    }, []);

    const navItems = [
        { name: t('list'), href: '/rules' },
        { name: t('favorites'), href: '/favorites', hasBadge: true },
        { name: t('submit'), href: '/submit' },
    ];

    return (
        <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 p-2 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                            <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Smart Rules Archive
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative text-sm font-medium transition-colors hover:text-white ${pathname.startsWith(item.href) ? 'text-white' : 'text-slate-400'
                                    }`}
                            >
                                {item.name}
                                {item.hasBadge && favoriteCount > 0 && (
                                    <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-sm shadow-purple-900/50">
                                        {favoriteCount}
                                    </span>
                                )}
                            </Link>
                        ))}
                        <div className="h-4 w-px bg-slate-800 ml-2"></div>
                        <ThemeToggle />
                        <LanguageSwitcher />
                    </nav>

                    {/* Mobile Navigation Button (Simple version) */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link href="/favorites" className="relative p-2 text-slate-400">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.07 6.323a1 1 0 00.95.69h6.642c.969 0 1.371 1.24.588 1.81l-5.378 3.908a1 1 0 00-.364 1.118l2.07 6.323c.3.921-.755 1.688-1.54 1.118l-5.378-3.908a1 1 0 00-1.175 0l-5.378 3.908c-.784.57-1.838-.197-1.539-1.118l2.07-6.323a1 1 0 00-.364-1.118L2.293 11.75c-.783-.57-.38-1.81.588-1.81h6.642a1 1 0 00.95-.69l2.07-6.323z" />
                            </svg>
                            {favoriteCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white">
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/rules" className="p-2 text-slate-400">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
