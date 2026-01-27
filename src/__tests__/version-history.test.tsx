import { render } from '@testing-library/react';
import VersionHistory from '@/components/rules/VersionHistory';

// Mock fetch
global.fetch = jest.fn();

describe('VersionHistory Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches rule history with correct basePath', async () => {
        // Mock NEXT_PUBLIC_BASE_PATH
        process.env.NEXT_PUBLIC_BASE_PATH = '/srules';

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                'test/slug': []
            })
        });

        render(<VersionHistory slug="test/slug" currentContent="content" />);

        // Verify fetch call path with basePath
        expect(global.fetch).toHaveBeenCalledWith('/srules/rule-history.json');

        // Reset env
        delete process.env.NEXT_PUBLIC_BASE_PATH;
    });

    it('fetches rule history without basePath when not set', async () => {
        // Ensure no env var
        delete process.env.NEXT_PUBLIC_BASE_PATH;

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({})
        });

        render(<VersionHistory slug="test/slug" currentContent="content" />);

        // Verify fetch call path without basePath
        expect(global.fetch).toHaveBeenCalledWith('/rule-history.json');
    });
});
