'use client';

import { motion } from 'framer-motion';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useFavorites } from '@/hooks/queries/useFavoriteQueries';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    const t = useTranslations('common');
    const pathname = usePathname();
    const { data: favorites } = useFavorites();
    const favoriteCount = favorites?.length ?? 0;

    const navItems = [
        { name: t('list'), href: '/rules' },
        { name: t('favorites'), href: '/favorites', hasBadge: true },
        { name: t('submit'), href: '/submit' },
    ];

    return (
        <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="border-b border-white/5 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40"
        >
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div 
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-2 shadow-lg shadow-violet-500/20"
                        >
                            <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </motion.div>
                        <span className="text-xl sm:text-2xl font-bold text-gradient-premium tracking-tight">
                            Smart Rules Archive
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative text-sm font-semibold transition-all hover:text-white ${pathname.startsWith(item.href) ? 'text-white' : 'text-slate-400'
                                    }`}
                            >
                                {item.name}
                                {pathname.startsWith(item.href) && (
                                    <motion.div 
                                        layoutId="nav-underline"
                                        className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500"
                                    />
                                )}
                                {item.hasBadge && favoriteCount > 0 && (
                                    <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-sm shadow-violet-900/50">
                                        {favoriteCount}
                                    </span>
                                )}
                            </Link>
                        ))}
                        <div className="h-4 w-px bg-white/10 ml-2"></div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <LanguageSwitcher />
                        </div>
                    </nav>

                    {/* Mobile Navigation Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link href="/favorites" className="relative p-2 text-slate-400" aria-label={t('favorites')}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.07 6.323a1 1 0 00.95.69h6.642c.969 0 1.371 1.24.588 1.81l-5.378 3.908a1 1 0 00-.364 1.118l2.07 6.323c.3.921-.755 1.688-1.54 1.118l-5.378-3.908a1 1 0 00-1.175 0l-5.378 3.908c-.784.57-1.838-.197-1.539-1.118l2.07-6.323a1 1 0 00-.364-1.118L2.293 11.75c-.783-.57-.38-1.81.588-1.81h6.642a1 1 0 00.95-.69l2.07-6.323z" />
                            </svg>
                            {favoriteCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
