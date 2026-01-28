'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useFavorites } from '@/hooks/queries/useFavoriteQueries';
import { useRecentViews } from '@/hooks/queries/useRecentViewQueries';
import RuleCard from '@/components/rules/RuleCard';

export default function FavoritesPage() {
    const ct = useTranslations('common');
    const { data: favorites = [], isLoading: isLoadingFavorites } = useFavorites();
    const { data: recentViews = [], isLoading: isLoadingRecent } = useRecentViews(5);

    const isLoading = isLoadingFavorites || isLoadingRecent;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="py-12">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold flex items-center gap-4 text-white font-noto">
                                <span className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
                                    <svg className="h-8 w-8 text-yellow-500 fill-current" viewBox="0 0 24 24">
                                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.07 6.323a1 1 0 00.95.69h6.642c.969 0 1.371 1.24.588 1.81l-5.378 3.908a1 1 0 00-.364 1.118l2.07 6.323c.3.921-.755 1.688-1.54 1.118l-5.378-3.908a1 1 0 00-1.175 0l-5.378 3.908c-.784.57-1.838-.197-1.539-1.118l2.07-6.323a1 1 0 00-.364-1.118L2.293 11.75c-.783-.57-.38-1.81.588-1.81h6.642a1 1 0 00.95-.69l2.07-6.323z" />
                                    </svg>
                                </span>
                                {ct('favorites')}
                            </h1>
                            <p className="mt-4 text-lg text-slate-400 font-medium font-noto leading-relaxed">
                                나중에 다시 보고 싶은 규칙들을 모아두었습니다.
                            </p>
                        </div>

                        {favorites.length > 0 ? (
                            <div className="grid gap-6">
                                {favorites.map((rule) => (
                                    <RuleCard
                                        key={rule.slug}
                                        slug={rule.slug}
                                        title={rule.title}
                                        excerpt={rule.excerpt || ''}
                                        author={rule.author}
                                        created={rule.created}
                                        difficulty={rule.difficulty}
                                        category={rule.category}
                                        tags={rule.tags}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[32px] border border-dashed border-slate-800 bg-slate-900/20 p-16 text-center animate-fade-in shadow-inner">
                                <div className="mx-auto h-20 w-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-inner">
                                    <svg className="h-10 w-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 font-noto">즐겨찾기가 비어있습니다</h3>
                                <p className="text-slate-400 max-w-sm mx-auto mb-8 font-medium font-noto">
                                    규칙 상세 페이지에서 즐겨찾기에 추가하면 이곳에서 쉽고 빠르게 다시 찾아볼 수 있습니다.
                                </p>
                                <Link
                                    href="/rules"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-bold text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/40 hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm"
                                >
                                    {ct('list')} 둘러보기
                                </Link>
                            </div>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="sticky top-24 space-y-8">
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 lowercase tracking-tight font-noto">
                                    <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {ct('recent_views' as any) || 'RECENT VIEWS'}
                                </h3>
                                {recentViews.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentViews.map((view) => (
                                            <Link
                                                key={view.slug}
                                                href={`/rules/${view.slug}`}
                                                className="group block rounded-xl border border-slate-800 bg-slate-950 p-4 transition-all hover:border-indigo-500/50 hover:bg-slate-900 shadow-sm"
                                            >
                                                <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 line-clamp-1 mb-1 transition-colors">
                                                    {view.title}
                                                </h4>
                                                <span className="text-[10px] uppercase font-black tracking-widest text-slate-600 group-hover:text-slate-500 transition-colors">
                                                    {new Date(view.viewedAt).toLocaleDateString()} VISITED
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-4 font-medium italic font-noto">최근 본 규칙이 없습니다.</p>
                                )}
                            </div>

                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 border border-slate-800 shadow-2xl">
                                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-500/10 blur-3xl"></div>
                                <h3 className="text-[10px] font-black text-purple-400 mb-3 uppercase tracking-[0.3em]">System.Notice</h3>
                                <p className="text-xs text-slate-400 leading-relaxed font-semibold font-noto">
                                    즐겨찾기 및 최근 기록은 브라우저의 로컬 스토리지에 암호화 없이 저장됩니다. 브라우저 데이터 삭제 시 초기화됩니다.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
