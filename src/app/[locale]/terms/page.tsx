import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('footer');

    return (
        <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">{t('terms')}</h1>
            <div className="prose prose-invert prose-lg text-slate-400">
                <p>
                    이용약관 페이지입니다. 현재 준비 중입니다.
                </p>
                <p>
                    This is the Terms of Service page. It is currently under construction.
                </p>
            </div>
        </div>
    );
}
