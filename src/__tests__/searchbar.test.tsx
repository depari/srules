import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchBar from '@/components/common/SearchBar';
import { resetSearchServiceForTest } from '@/hooks/queries/useSearchQueries';

// Mock fetch
global.fetch = jest.fn();

// Create wrapper with QueryClient
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={createTestQueryClient()}>
        {children}
    </QueryClientProvider>
);

describe('SearchBar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        resetSearchServiceForTest();
    });

    it('fetches search index with correct basePath upon input', async () => {
        // Mock NEXT_PUBLIC_BASE_PATH
        process.env.NEXT_PUBLIC_BASE_PATH = '/srules';

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
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

        render(<SearchBar />, { wrapper });

        // Simulate input to trigger search
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });

        // Wait for debounce and query execution
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/srules/search-index.json');
        }, { timeout: 2000 });

        // Reset env
        delete process.env.NEXT_PUBLIC_BASE_PATH;
    });

    it('fetches search index without basePath when not set upon input', async () => {
        // Ensure no env var
        delete process.env.NEXT_PUBLIC_BASE_PATH;

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ([])
        });

        render(<SearchBar />, { wrapper });

        // Simulate input
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });

        // Wait for fetch
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/search-index.json');
        });
    });
});
