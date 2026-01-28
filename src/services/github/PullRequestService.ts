/**
 * Pull Request 서비스 구현
 * 책임: Pull Request 생성 및 관리
 */

import type { IPullRequestService, IGitHubHttpClient } from '../interfaces/IGitHubService';

export class PullRequestService implements IPullRequestService {
    constructor(
        private readonly httpClient: IGitHubHttpClient,
        private readonly owner: string,
        private readonly repo: string
    ) { }

    /**
     * Pull Request 생성
     */
    async createPullRequest(
        title: string,
        head: string,
        body: string
    ): Promise<{ url: string; number: number }> {
        const data = await this.httpClient.request<{ html_url: string; number: number }>(
            `/repos/${this.owner}/${this.repo}/pulls`,
            {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    head,
                    base: 'main',
                    body,
                }),
            }
        );

        return {
            url: data.html_url,
            number: data.number,
        };
    }
}
