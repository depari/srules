
import { renderHook, act } from '@testing-library/react';
import { useDeleteRule } from '@/hooks/useRuleActions';
import { useDeleteRuleMutation } from '@/hooks/queries/useGitHubQueries';

// Mock the mutation hook
jest.mock('@/hooks/queries/useGitHubQueries', () => ({
    useDeleteRuleMutation: jest.fn(),
}));

describe('useDeleteRule Refactoring TC', () => {
    const params = {
        slug: 'test-slug',
        title: 'Test Title',
        author: 'Test Author',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        global.confirm = jest.fn().mockReturnValue(true);
        global.alert = jest.fn();
    });

    it('should use useDeleteRuleMutation and not require external action function', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue({ prUrl: 'https://github.com/pr/1' });
        (useDeleteRuleMutation as jest.Mock).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
        });

        const { result } = renderHook(() => useDeleteRule(params));

        // This should fail because currently deleteRule requires an argument
        await act(async () => {
            // @ts-ignore - purposefully calling without argument to see it fail or use old logic
            await result.current.deleteRule();
        });

        expect(mockMutateAsync).toHaveBeenCalledWith({
            title: params.title,
            originalPath: `rules/${params.slug}.md`,
            author: params.author,
        });
        expect(result.current.deletePrUrl).toBe('https://github.com/pr/1');
    });
});
