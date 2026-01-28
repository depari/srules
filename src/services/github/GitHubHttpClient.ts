/**
 * GitHub HTTP 클라이언트 구현
 * 책임: GitHub API와의 HTTP 통신만 담당
 */

import type { IGitHubHttpClient } from '../interfaces/IGitHubService';

export class GitHubHttpClient implements IGitHubHttpClient {
    private readonly baseURL = 'https://api.github.com';

    constructor(
        private readonly owner: string,
        private readonly repo: string,
        private readonly token: string
    ) { }

    /**
     * GitHub API 요청
     */
    async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                `GitHub API Error: ${response.status} ${response.statusText}\n${JSON.stringify(errorData, null, 2)}`
            );
        }

        return response.json();
    }

    /**
     * Repository 정보 반환
     */
    getRepoInfo() {
        return {
            owner: this.owner,
            repo: this.repo,
        };
    }
}
