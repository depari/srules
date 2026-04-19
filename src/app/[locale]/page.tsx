import { getAllRules, getFeaturedRules, getAllCategories } from "@/lib/rules";
import { nameToSlug } from "@/lib/slug";
import SearchBar from "@/components/common/SearchBar";
import RuleCard from "@/components/rules/RuleCard";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/common/Animations";

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
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 bg-slate-950">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold mb-8 shadow-inner shadow-violet-500/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              {t('hero.badge', { count: totalRules })}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-8">
              <span className="block text-white mb-2">{t('hero.title')}</span>
              <span className="text-gradient-premium">
                {t('hero.subtitle')}
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
              {t('hero.description')}
            </p>
          </FadeIn>

          {/* Search Bar */}
          <FadeIn delay={0.3}>
            <div className="mt-12 mx-auto max-w-2xl bg-white/[0.03] backdrop-blur-xl p-2 rounded-2xl border border-white/10 focus-within:border-violet-500/50 transition-all shadow-2xl">
              <SearchBar placeholder={t('search_placeholder')} />
            </div>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn delay={0.4}>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <span className="text-sm text-slate-500 py-2 mr-2">{t('popular_categories')}:</span>
              {categories.slice(0, 5).map((category) => (
                <Link
                  key={category.name}
                  href={`/categories/${nameToSlug(category.name)}`}
                  className="rounded-xl bg-white/5 border border-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all shadow-sm font-bold uppercase tracking-tight"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Rules */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{t('featured.title')}</h2>
            <p className="text-slate-400 mt-2 font-medium">{t('featured.description')}</p>
          </div>
          <Link href="/rules" className="group flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-black text-sm uppercase tracking-widest">
            {t('featured.view_all')}
            <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </FadeIn>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredRules.map((rule) => (
            <StaggerItem key={rule.slug} className="h-full">
              <RuleCard
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
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5">
        <FadeIn className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold text-white tracking-tight">{t('categories.title')}</h2>
          <p className="text-slate-400 mt-2 font-medium">{t('categories.description')}</p>
        </FadeIn>
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <StaggerItem key={category.name}>
              <Link
                href={`/categories/${nameToSlug(category.name)}`}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 hover:border-cyan-500/30 transition-all hover:shadow-2xl hover:shadow-cyan-500/10 block h-full backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="text-4xl font-black bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {category.count}
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 text-slate-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-all">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-200 group-hover:text-cyan-400 transition-colors uppercase tracking-widest font-mono">
                  {category.name}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </main>
  );
}
