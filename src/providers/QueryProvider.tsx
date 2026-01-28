/**
 * React Query Provider
 * 클라이언트 사이드 상태 관리 및 캐싱 최적화
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    // 각 클라이언트마다 새로운 QueryClient 인스턴스 생성
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // SSG 기반이므로 staleTime을 길게 설정
                        staleTime: 60 * 1000, // 1분
                        // 백그라운드에서 자동 리페치 비활성화
                        refetchOnWindowFocus: false,
                        // 네트워크 재연결 시 리페치 비활성화
                        refetchOnReconnect: false,
                        // 컴포넌트 마운트 시 리페치 비활성화 (SSG 데이터)
                        refetchOnMount: false,
                        // 리트라이 설정
                        retry: 1,
                    },
                    mutations: {
                        // Mutation 리트라이
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* 개발 환경에서만 DevTools 표시 */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}
