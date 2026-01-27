import { getAllRules, getFeaturedRules, getAllCategories } from "@/lib/rules";
import SearchBar from "@/components/common/SearchBar";
import RuleCard from "@/components/rules/RuleCard";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });

  const featuredRules = getFeaturedRules().slice(0, 6);
  const categories = getAllCategories().slice(0, 8);
  const totalRules = getAllRules().length;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6 animate-fade-in shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            {t('hero.badge', { count: totalRules })}
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
            <span className="block text-slate-200">{t('hero.title')}</span>
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
              {t('hero.subtitle')}
            </span>
          </h1>
          <p className="mt-6 text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-noto">
            {t('hero.description')}
          </p>

          {/* Search Bar */}
          <div className="mt-12 mx-auto max-w-2xl bg-slate-900/50 p-2 rounded-2xl border border-slate-800 focus-within:border-purple-500/50 transition-all shadow-2xl">
            <SearchBar placeholder={t('search_placeholder')} />
          </div>

          {/* Quick Links */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-slate-500 py-2 mr-2">{t('popular_categories')}:</span>
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase()}`}
                className="rounded-full bg-slate-800/50 border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm font-bold uppercase tracking-tighter"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rules */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight font-noto">{t('featured.title')}</h2>
            <p className="text-slate-400 mt-1 font-medium font-noto">{t('featured.description')}</p>
          </div>
          <Link href="/rules" className="group flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-black text-sm uppercase tracking-[0.2em]">
            {t('featured.view_all')}
            <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredRules.map((rule) => (
            <RuleCard
              key={rule.slug}
              slug={rule.slug}
              title={rule.title}
              excerpt={rule.excerpt}
              author={rule.author}
              created={rule.created}
              difficulty={rule.difficulty}
              category={rule.category}
              tags={rule.tags}
              featured={rule.featured}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight font-noto">{t('categories.title')}</h2>
          <p className="text-slate-400 mt-1 font-medium font-noto">{t('categories.description')}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8 hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="text-4xl font-black bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {category.count}
                </div>
                <div className="p-3 rounded-xl bg-slate-800 text-slate-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-all shadow-inner">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="text-xl font-bold text-slate-200 group-hover:text-cyan-400 transition-colors uppercase tracking-widest font-mono">
                {category.name}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
