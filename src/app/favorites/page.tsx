'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFavorites, getRecentViews, FavoriteItem, RecentViewItem } from '@/lib/storage';
import RuleCard from '@/components/rules/RuleCard';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [recentViews, setRecentViews] = useState<RecentViewItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setFavorites(getFavorites());
        setRecentViews(getRecentViews());
        setIsLoading(false);
    }, []);

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
                            <h1 className="text-4xl font-bold flex items-center gap-3">
                                <svg className="h-8 w-8 text-yellow-500 fill-current" viewBox="0 0 24 24">
                                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.07 6.323a1 1 0 00.95.69h6.642c.969 0 1.371 1.24.588 1.81l-5.378 3.908a1 1 0 00-.364 1.118l2.07 6.323c.3.921-.755 1.688-1.54 1.118l-5.378-3.908a1 1 0 00-1.175 0l-5.378 3.908c-.784.57-1.838-.197-1.539-1.118l2.07-6.323a1 1 0 00-.364-1.118L2.293 11.75c-.783-.57-.38-1.81.588-1.81h6.642a1 1 0 00.95-.69l2.07-6.323z" />
                                </svg>
                                즐겨찾는 규칙
                            </h1>
                            <p className="mt-2 text-slate-400">
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
                                        excerpt={rule.excerpt}
                                        author={rule.author}
                                        created={rule.created}
                                        difficulty={rule.difficulty}
                                        category={rule.category}
                                        tags={rule.tags}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
                                <div className="mx-auto h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                                    <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.07 6.323a1 1 0 00.95.69h6.642c.969 0 1.371 1.24.588 1.81l-5.378 3.908a1 1 0 00-.364 1.118l2.07 6.323c.3.921-.755 1.688-1.54 1.118l-5.378-3.908a1 1 0 00-1.175 0l-5.378 3.908c-.784.57-1.838-.197-1.539-1.118l2.07-6.323a1 1 0 00-.364-1.118L2.293 11.75c-.783-.57-.38-1.81.588-1.81h6.642a1 1 0 00.95-.69l2.07-6.323z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">즐겨찾기가 비어있습니다</h3>
                                <p className="mt-2 text-slate-400">
                                    규칙 상세 페이지에서 별 아이콘을 눌러 즐겨찾기에 추가해보세요.
                                </p>
                                <Link
                                    href="/rules"
                                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 transition-all"
                                >
                                    규칙 둘러보기
                                </Link>
                            </div>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="sticky top-8 space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    최근 본 규칙
                                </h3>
                                {recentViews.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentViews.map((view) => (
                                            <Link
                                                key={view.slug}
                                                href={`/rules/${view.slug}`}
                                                className="block rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-purple-500/50 hover:bg-slate-900"
                                            >
                                                <h4 className="text-sm font-medium text-white line-clamp-1 mb-1">
                                                    {view.title}
                                                </h4>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(view.viewedAt).toLocaleDateString()} 방문
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">최근 본 규칙이 없습니다.</p>
                                )}
                            </div>

                            <div className="rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 p-6 border border-purple-500/20">
                                <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">공지사항</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    즐겨찾기 기능은 브라우저의 로컬 스토리지에 저장되므로, 브라우저를 변경하거나 캐시를 삭제하면 초기화될 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
