/**
 * useRuleActions 훅 테스트
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useCopyRule, useDownloadRule, useShareRule, useFavoriteRule, useDeleteRule } from '@/hooks/useRuleActions';
import { getFavoriteService } from '@/services/FavoriteService';
import { getRecentViewService } from '@/services/RecentViewService';
import type { FavoriteItem } from '@/types/rule';

// Mock services
jest.mock('@/services/FavoriteService');
jest.mock('@/services/RecentViewService');

describe('useRuleActions hooks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();

        // Mock clipboard API
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn().mockResolvedValue(undefined),
            },
        });

        // Mock URL methods
        global.URL.createObjectURL = jest.fn(() => 'blob:test');
        global.URL.revokeObjectURL = jest.fn();
    });

    describe('useCopyRule', () => {
        it('should copy content to clipboard', async () => {
            const { result } = renderHook(() => useCopyRule('test content'));

            await act(async () => {
                await result.current.copy();
            });

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test content');
            expect(result.current.copied).toBe(true);
        });

        it('should reset copied state after 2 seconds', async () => {
            jest.useFakeTimers();
            const { result } = renderHook(() => useCopyRule('test content'));

            await act(async () => {
                await result.current.copy();
            });

            expect(result.current.copied).toBe(true);

            act(() => {
                jest.advanceTimersByTime(2000);
            });

            await waitFor(() => {
                expect(result.current.copied).toBe(false);
            });

            jest.useRealTimers();
        });
    });

    describe('useDownloadRule', () => {
        it('should create download link and trigger download', () => {
            const mockClick = jest.fn();
            const mockCreateElement = jest.spyOn(document, 'createElement');
            mockCreateElement.mockReturnValue({
                click: mockClick,
                href: '',
                download: '',
            } as any);

            const { result } = renderHook(() => useDownloadRule('test-slug', 'test content'));

            act(() => {
                result.current.download();
            });

            expect(global.URL.createObjectURL).toHaveBeenCalled();
            expect(mockClick).toHaveBeenCalled();
            expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test');

            mockCreateElement.mockRestore();
        });
    });

    describe('useShareRule', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'location', {
                value: { href: 'https://example.com/test' },
                writable: true,
            });
        });

        it('should copy URL to clipboard', async () => {
            const { result } = renderHook(() => useShareRule());

            await act(async () => {
                await result.current.share();
            });

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/test');
            expect(result.current.sharesCopied).toBe(true);
        });

        it('should reset sharesCopied state after 2 seconds', async () => {
            jest.useFakeTimers();
            const { result } = renderHook(() => useShareRule());

            await act(async () => {
                await result.current.share();
            });

            expect(result.current.sharesCopied).toBe(true);

            act(() => {
                jest.advanceTimersByTime(2000);
            });

            await waitFor(() => {
                expect(result.current.sharesCopied).toBe(false);
            });

            jest.useRealTimers();
        });
    });

    describe('useFavoriteRule', () => {
        const testRule: FavoriteItem = {
            slug: 'test-slug',
            title: 'Test Title',
            category: ['TypeScript'],
            tags: ['test'],
            created: '2026-01-01',
            author: 'Test Author',
        };

        it('should check favorite status on mount', () => {
            const mockFavoriteService = {
                isFavorite: jest.fn().mockReturnValue(false),
                toggleFavorite: jest.fn(),
            };

            const mockRecentViewService = {
                addRecentView: jest.fn(),
            };

            (getFavoriteService as jest.Mock).mockReturnValue(mockFavoriteService);
            (getRecentViewService as jest.Mock).mockReturnValue(mockRecentViewService);

            renderHook(() => useFavoriteRule('test-slug', testRule));

            expect(mockFavoriteService.isFavorite).toHaveBeenCalledWith('test-slug');
            expect(mockRecentViewService.addRecentView).toHaveBeenCalledWith('test-slug', 'Test Title');
        });

        it('should toggle favorite and dispatch event', () => {
            const mockFavoriteService = {
                isFavorite: jest.fn().mockReturnValue(false),
                toggleFavorite: jest.fn().mockReturnValue(true),
            };

            const mockRecentViewService = {
                addRecentView: jest.fn(),
            };

            (getFavoriteService as jest.Mock).mockReturnValue(mockFavoriteService);
            (getRecentViewService as jest.Mock).mockReturnValue(mockRecentViewService);

            const mockDispatchEvent = jest.spyOn(window, 'dispatchEvent');

            const { result } = renderHook(() => useFavoriteRule('test-slug', testRule));

            act(() => {
                result.current.toggleFavorite();
            });

            expect(mockFavoriteService.toggleFavorite).toHaveBeenCalledWith(testRule);
            expect(result.current.favorited).toBe(true);
            expect(mockDispatchEvent).toHaveBeenCalled();

            mockDispatchEvent.mockRestore();
        });
    });

    describe('useDeleteRule', () => {
        const params = {
            slug: 'test-slug',
            title: 'Test Title',
            author: 'Test Author',
        };

        it('should handle delete action successfully', async () => {
            global.confirm = jest.fn().mockReturnValue(true);
            global.alert = jest.fn();

            const mockDeleteAction = jest.fn().mockResolvedValue('https://github.com/pr/1');

            const { result } = renderHook(() => useDeleteRule(params));

            await act(async () => {
                await result.current.deleteRule(mockDeleteAction);
            });

            expect(global.confirm).toHaveBeenCalled();
            expect(mockDeleteAction).toHaveBeenCalledWith(params);
            expect(result.current.deletePrUrl).toBe('https://github.com/pr/1');
            expect(global.alert).toHaveBeenCalledWith('삭제 요청 PR이 성공적으로 생성되었습니다.');
        });

        it('should not delete when user cancels', async () => {
            global.confirm = jest.fn().mockReturnValue(false);
            const mockDeleteAction = jest.fn();

            const { result } = renderHook(() => useDeleteRule(params));

            await act(async () => {
                await result.current.deleteRule(mockDeleteAction);
            });

            expect(global.confirm).toHaveBeenCalled();
            expect(mockDeleteAction).not.toHaveBeenCalled();
        });

        it('should handle delete errors', async () => {
            global.confirm = jest.fn().mockReturnValue(true);
            global.alert = jest.fn();
            const consoleError = jest.spyOn(console, 'error').mockImplementation();

            const mockDeleteAction = jest.fn().mockRejectedValue(new Error('Delete failed'));

            const { result } = renderHook(() => useDeleteRule(params));

            await act(async () => {
                await result.current.deleteRule(mockDeleteAction);
            });

            expect(consoleError).toHaveBeenCalled();
            expect(global.alert).toHaveBeenCalledWith('삭제 요청 중 오류가 발생했습니다.');
            expect(result.current.isDeleting).toBe(false);

            consoleError.mockRestore();
        });
    });
});
