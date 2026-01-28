/**
 * GitHub 서비스 인터페이스 정의
 * DIP 원칙 적용: 구체적인 구현이 아닌 추상화에 의존
 */

/**
 * HTTP 클라이언트 인터페이스
 * 책임: GitHub API와의 HTTP 통신
 */
export interface IGitHubHttpClient {
    request<T = any>(endpoint: string, options?: RequestInit): Promise<T>;
}

/**
 * Git 작업 서비스 인터페이스
 * 책임: 브랜치, 파일 생성/수정/삭제 등 Git 저수준 작업
 */
export interface IGitOperationsService {
    getMainBranchSHA(): Promise<string>;
    createBranch(branchName: string, fromSHA: string): Promise<void>;
    getFileInfo(path: string): Promise<{ sha: string; content: string }>;
    createOrUpdateFile(
        path: string,
        content: string,
        message: string,
        branch: string,
        sha?: string
    ): Promise<void>;
    deleteFile(
        path: string,
        message: string,
        branch: string,
        sha: string
    ): Promise<void>;
}

/**
 * Pull Request 서비스 인터페이스
 * 책임: Pull Request 생성 및 관리
 */
export interface IPullRequestService {
    createPullRequest(
        title: string,
        head: string,
        body: string
    ): Promise<{ url: string; number: number }>;
}

/**
 * 규칙 제출 서비스 인터페이스
 * 책임: 규칙 제출/수정/삭제를 위한 고수준 작업
 */
export interface IRuleSubmissionService {
    submitRule(params: RuleSubmissionParams): Promise<{ prUrl: string; prNumber: number }>;
    updateRule(params: RuleUpdateParams): Promise<{ prUrl: string; prNumber: number }>;
    deleteRule(params: RuleDeleteParams): Promise<{ prUrl: string; prNumber: number }>;
}

/**
 * 규칙 제출 파라미터
 */
export interface RuleSubmissionParams {
    title: string;
    content: string;
    category: string[];
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    author: string;
    fileName: string;
    isEdit?: boolean;
}

/**
 * 규칙 수정 파라미터
 */
export interface RuleUpdateParams extends RuleSubmissionParams {
    originalPath: string;
}

/**
 * 규칙 삭제 파라미터
 */
export interface RuleDeleteParams {
    title: string;
    originalPath: string;
    author: string;
}
