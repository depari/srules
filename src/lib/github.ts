/**
 * GitHub 클라이언트 팩토리
 * 기존 API와의 호환성을 유지하면서 새로운 서비스 아키텍처 제공
 */

import { getStoredToken } from '@/lib/storage';
import { GitHubHttpClient } from '@/services/github/GitHubHttpClient';
import { GitOperationsService } from '@/services/github/GitOperationsService';
import { PullRequestService } from '@/services/github/PullRequestService';
import { RuleSubmissionService } from '@/services/github/RuleSubmissionService';
import type {
    RuleSubmissionParams,
    RuleUpdateParams,
    RuleDeleteParams,
} from '@/services/interfaces/IGitHubService';

/**
 * 기존 API 호환을 위한래퍼 클래스
 * @deprecated 새 코드에서는 RuleSubmissionService를 직접 사용하세요
 */
export class GitHubAPIClient {
    private ruleSubmissionService: RuleSubmissionService;

    constructor(
        owner: string,
        repo: string,
        token: string
    ) {
        // 서비스 인스턴스 생성 (의존성 주입)
        const httpClient = new GitHubHttpClient(owner, repo, token);
        const gitOps = new GitOperationsService(httpClient, owner, repo);
        const prService = new PullRequestService(httpClient, owner, repo);
        this.ruleSubmissionService = new RuleSubmissionService(gitOps, prService);
    }

    /**
     * 규칙 제출
     * @deprecated 새 코드에서는 RuleSubmissionService.submitRule을 사용하세요
     */
    async submitRule(params: any): Promise<{ prUrl: string; prNumber: number }> {
        const submissionParams: RuleSubmissionParams = {
            title: params.title,
            content: params.content,
            category: params.category,
            tags: params.tags,
            difficulty: params.difficulty,
            author: params.author,
            fileName: params.fileName,
            isEdit: params.isEdit,
        };

        if (params.isEdit && params.originalPath) {
            const updateParams: RuleUpdateParams = {
                ...submissionParams,
                originalPath: params.originalPath,
            };
            return this.ruleSubmissionService.updateRule(updateParams);
        }

        return this.ruleSubmissionService.submitRule(submissionParams);
    }

    /**
     * 규칙 수정
     * @deprecated 새 코드에서는 RuleSubmissionService.updateRule을 사용하세요
     */
    async updateRule(params: any): Promise<{ prUrl: string; prNumber: number }> {
        const updateParams: RuleUpdateParams = {
            title: params.title,
            content: params.content,
            category: params.category,
            tags: params.tags,
            difficulty: params.difficulty,
            author: params.author,
            fileName: params.fileName,
            originalPath: params.originalPath,
        };

        return this.ruleSubmissionService.updateRule(updateParams);
    }

    /**
     * 규칙 삭제
     * @deprecated 새 코드에서는 RuleSubmissionService.deleteRule을 사용하세요
     */
    async deleteRule(params: { title: string; originalPath: string; author: string }): Promise<{ prUrl: string; prNumber: number }> {
        const deleteParams: RuleDeleteParams = {
            title: params.title,
            originalPath: params.originalPath,
            author: params.author,
        };

        return this.ruleSubmissionService.deleteRule(deleteParams);
    }
}

/**
 * GitHub API 클라이언트 인스턴스 생성 헬퍼
 * 토큰이 없으면 null 반환
 */
export function createGitHubClient(): GitHubAPIClient | null {
    const token = getStoredToken();

    if (!token) {
        console.warn('GitHub token not found. Some features will be limited.');
        return null;
    }

    const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'depari';
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'srules';

    return new GitHubAPIClient(owner, repo, token);
}

/**
 * 새로운 GitHub 서비스 생성 헬퍼
 * DI 패턴을 사용하여 서비스 간 결합도를 낮춤
 */
export function createGitHubServices(token?: string) {
    const actualToken = token || getStoredToken();

    if (!actualToken) {
        throw new Error('GitHub token is required');
    }

    const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'depari';
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'srules';

    // HTTP 클라이언트 생성
    const httpClient = new GitHubHttpClient(owner, repo, actualToken);

    // 각 서비스 생성 (의존성 주입)
    const gitOps = new GitOperationsService(httpClient, owner, repo);
    const prService = new PullRequestService(httpClient, owner, repo);
    const ruleSubmission = new RuleSubmissionService(gitOps, prService);

    return {
        httpClient,
        gitOps,
        prService,
        ruleSubmission,
    };
}
