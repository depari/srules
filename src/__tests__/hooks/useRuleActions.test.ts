/**
 * useRuleActions 훅 테스트
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useCopyRule, useDownloadRule, useShareRule, useFavoriteRule, useDeleteRule } from '@/hooks/useRuleActions';

// Mock hooks
const mockToggle = jest.fn();
const mockAddRecentView = jest.fn();

jest.mock('@/hooks/queries/useFavoriteQueries', () => ({
    useIsFavorite: jest.fn((slug) => ({ data: false })),
    useToggleFavorite: jest.fn(() => ({ toggle: mockToggle })),
}));

jest.mock('@/hooks/queries/useRecentViewQueries', () => ({
    useAddRecentView: jest.fn(() => ({ mutate: mockAddRecentView })),
}));

// Re-import types/mocks
import { useIsFavorite } from '@/hooks/queries/useFavoriteQueries';

describe('useRuleActions hooks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockToggle.mockClear();
        mockAddRecentView.mockClear();

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

            // Save original createElement
            const originalCreateElement = document.createElement.bind(document);

            // Spy on createElement to return real element but with mocked click
            const createElementSpy = jest.spyOn(document, 'createElement');
            createElementSpy.mockImplementation((tagName: string, options?: any) => {
                const element = originalCreateElement(tagName, options);
                if (tagName === 'a') {
                    jest.spyOn(element, 'click').mockImplementation(mockClick);
                }
                return element;
            });

            // Spy on append/remove to verify calls, but allow default implementation (pass-through)
            const appendSpy = jest.spyOn(document.body, 'appendChild');
            const removeSpy = jest.spyOn(document.body, 'removeChild');

            const { result } = renderHook(() => useDownloadRule('test-slug', 'test content'));

            act(() => {
                result.current.download();
            });

            expect(global.URL.createObjectURL).toHaveBeenCalled();
            expect(mockClick).toHaveBeenCalled();
            expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test');

            createElementSpy.mockRestore();
            appendSpy.mockRestore();
            removeSpy.mockRestore();
        });
    });

    describe('useShareRule', () => {
        it('should copy URL to clipboard', async () => {
            const { result } = renderHook(() => useShareRule());

            await act(async () => {
                await result.current.share();
            });

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
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
        const testRule = {
            slug: 'test-slug',
            title: 'Test Title',
            category: ['TypeScript'],
            tags: ['test'],
            created: '2026-01-01',
            author: 'Test Author',
        };

        it('should check favorite status on mount', () => {
            (useIsFavorite as jest.Mock).mockReturnValue({ data: true });

            const { result } = renderHook(() => useFavoriteRule('test-slug', testRule));

            expect(result.current.favorited).toBe(true);
            expect(mockAddRecentView).toHaveBeenCalledWith(testRule);
        });

        it('should toggle favorite', () => {
            (useIsFavorite as jest.Mock).mockReturnValue({ data: false });

            const { result } = renderHook(() => useFavoriteRule('test-slug', testRule));

            act(() => {
                result.current.toggleFavorite();
            });

            expect(mockToggle).toHaveBeenCalledWith(testRule);
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
