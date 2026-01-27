import { render, screen, waitFor } from '@testing-library/react';
import SearchBar from '@/components/common/SearchBar';

// Mock fetch
global.fetch = jest.fn();

describe('SearchBar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches search index with correct basePath', async () => {
        // Mock NEXT_PUBLIC_BASE_PATH
        process.env.NEXT_PUBLIC_BASE_PATH = '/srules';

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ([
                {
                    title: 'Test Rule',
                    slug: 'test/rule',
                    excerpt: 'Test excerpt',
                    category: ['Test'],
                    tags: ['test'],
                    author: 'Tester'
                }
            ])
        });

        render(<SearchBar />);

        // Verify fetch call path with basePath
        expect(global.fetch).toHaveBeenCalledWith('/srules/search-index.json');

        // Reset env
        delete process.env.NEXT_PUBLIC_BASE_PATH;
    });

    it('fetches search index without basePath when not set', async () => {
        // Ensure no env var
        delete process.env.NEXT_PUBLIC_BASE_PATH;

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ([])
        });

        render(<SearchBar />);

        // Verify fetch call path without basePath
        expect(global.fetch).toHaveBeenCalledWith('/search-index.json');
    });
});
