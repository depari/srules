'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const toggleLanguage = () => {
        const nextLocale = locale === 'ko' ? 'en' : 'ko';

        // router.replace handles the locale prefix automatically if configured
        // But since we are using next-intl/navigation hooks, it's straightforward
        router.replace(
            // @ts-expect-error next-intl types
            { pathname, params },
            { locale: nextLocale }
        );
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex h-9 px-3 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 text-xs font-bold text-slate-400 hover:text-white transition-all hover:border-slate-700 uppercase tracking-tighter"
            aria-label="언어 전환 / Switch Language"
        >
            <span className={locale === 'ko' ? 'text-purple-400' : ''}>KR</span>
            <span className="mx-1 text-slate-700">|</span>
            <span className={locale === 'en' ? 'text-purple-400' : ''}>EN</span>
        </button>
    );
}
