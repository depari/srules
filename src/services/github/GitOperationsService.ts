/**
 * Git 작업 서비스 구현
 * 책임: Git 브랜치 및 파일 관리 (저수준 Git 작업)
 */

import type { IGitOperationsService, IGitHubHttpClient } from '../interfaces/IGitHubService';

export class GitOperationsService implements IGitOperationsService {
    constructor(
        private readonly httpClient: IGitHubHttpClient,
        private readonly owner: string,
        private readonly repo: string
    ) { }

    /**
     * main 브랜치의 최신 SHA 가져오기
     */
    async getMainBranchSHA(): Promise<string> {
        const data = await this.httpClient.request<{ object: { sha: string } }>(
            `/repos/${this.owner}/${this.repo}/git/refs/heads/main`
        );
        return data.object.sha;
    }

    /**
     * 새 브랜치 생성
     */
    async createBranch(branchName: string, fromSHA: string): Promise<void> {
        await this.httpClient.request(`/repos/${this.owner}/${this.repo}/git/refs`, {
            method: 'POST',
            body: JSON.stringify({
                ref: `refs/heads/${branchName}`,
                sha: fromSHA,
            }),
        });
    }

    /**
     * 파일 정보(SHA 등) 가져오기
     */
    async getFileInfo(path: string): Promise<{ sha: string; content: string }> {
        const data = await this.httpClient.request<{ sha: string; content: string }>(
            `/repos/${this.owner}/${this.repo}/contents/${path}`
        );
        return {
            sha: data.sha,
            content: data.content,
        };
    }

    /**
     * 파일 생성 또는 업데이트
     */
    async createOrUpdateFile(
        path: string,
        content: string,
        message: string,
        branch: string,
        sha?: string
    ): Promise<void> {
        const body: any = {
            message,
            content: Buffer.from(content).toString('base64'),
            branch,
        };

        if (sha) {
            body.sha = sha;
        }

        await this.httpClient.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    /**
     * 파일 삭제
     */
    async deleteFile(
        path: string,
        message: string,
        branch: string,
        sha: string
    ): Promise<void> {
        await this.httpClient.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
            method: 'DELETE',
            body: JSON.stringify({
                message,
                sha,
                branch,
            }),
        });
    }
}
