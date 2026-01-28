/**
 * 규칙 제출/수정/삭제 서비스 인터페이스
 * GitHub PR 또는 Issue 생성을 통한 규칙 관리
 */

export interface SubmitRuleParams {
    title: string;
    content: string;
    category: string[];
    tags: string[];
    difficulty: string;
    author: string;
    fileName: string;
    isEdit?: boolean;
}

export interface UpdateRuleParams extends SubmitRuleParams {
    originalPath: string;
}

export interface DeleteRuleParams {
    title: string;
    originalPath: string;
    author: string;
}

export interface RuleServiceResult {
    prUrl: string;
    prNumber: number;
}

/**
 * 규칙 서비스 인터페이스
 * 구현체: GitHubRuleService, IssueRuleService
 */
export interface IRuleService {
    /**
     * 새로운 규칙 제출
     */
    submitRule(params: SubmitRuleParams): Promise<RuleServiceResult>;

    /**
     * 기존 규칙 수정
     */
    updateRule(params: UpdateRuleParams): Promise<RuleServiceResult>;

    /**
     * 규칙 삭제 요청
     */
    deleteRule(params: DeleteRuleParams): Promise<RuleServiceResult>;
}
