import { render, screen } from '@testing-library/react';
import SubmitClient from '@/components/submit/SubmitClient';

// Mock fetch
global.fetch = jest.fn();

describe('SubmitClient Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form correctly', () => {
        render(<SubmitClient />);
        expect(screen.getByLabelText('제목')).toBeInTheDocument();
        expect(screen.getByLabelText('작성자')).toBeInTheDocument();
        expect(screen.getByLabelText('난이도')).toBeInTheDocument();
        // Check Reset button (mocked translation 'reset')
        expect(screen.getByText('reset')).toBeInTheDocument();
    });

    it('fetches existing rule when edit param is present', async () => {
        // Mock searchParams to return ?edit=git/commit-messages
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.set('edit', 'git/commit-messages');

        const nextNavigation = require('next/navigation');
        (nextNavigation.useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            text: async () => `---
title: Test Rule
author: Tester
difficulty: beginner
category: [Git]
tags: [git, test]
---
# Test Content
`
        });

        render(<SubmitClient />);

        // Verify fetch call path - CRITICAL check for previous bug
        // It must call /rules/git/commit-messages.md (public folder)
        expect(global.fetch).toHaveBeenCalledWith('/rules/git/commit-messages.md');
    });

    it('fetches existing rule with basePath when configured', async () => {
        // Mock NEXT_PUBLIC_BASE_PATH
        process.env.NEXT_PUBLIC_BASE_PATH = '/srules';

        // Mock searchParams
        const mockSearchParams = new URLSearchParams();
        mockSearchParams.set('edit', 'git/commit-messages');

        const nextNavigation = require('next/navigation');
        (nextNavigation.useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

        // Mock fetch response
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            text: async () => '---'
        });

        render(<SubmitClient />);

        expect(global.fetch).toHaveBeenCalledWith('/srules/rules/git/commit-messages.md');

        // Reset env
        delete process.env.NEXT_PUBLIC_BASE_PATH;
    });
});
