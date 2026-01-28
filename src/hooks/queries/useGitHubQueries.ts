/**
 * GitHub API 관련 React Query Hooks
 * 규칙 제출, 수정, 삭제 등의 비동기 작업 관리
 */

import { useMutation } from '@tanstack/react-query';
import { createGitHubServices } from '@/lib/github';
import type {
    RuleSubmissionParams,
    RuleUpdateParams,
    RuleDeleteParams
} from '@/services/interfaces/IGitHubService';

// GitHub 서비스 인스턴스를 지연 생성하기 위한 헬퍼
// 컴포넌트 렌더링 시점이 아닌 실제 함수 호출 시점에 토큰 등을 확인
const getGitHubServices = () => {
    try {
        return createGitHubServices();
    } catch (error) {
        console.warn('GitHub 서비스 초기화 실패 (토큰 없음 가능성):', error);
        return null;
    }
};

/**
 * 규칙 제출 Mutation
 */
export function useSubmitRuleMutation() {
    return useMutation({
        mutationFn: async (params: RuleSubmissionParams) => {
            const services = getGitHubServices();
            if (!services) {
                throw new Error('GitHub 토큰이 설정되지 않았습니다.');
            }
            return await services.ruleSubmission.submitRule(params);
        }
    });
}

/**
 * 규칙 수정 Mutation
 */
export function useUpdateRuleMutation() {
    return useMutation({
        mutationFn: async (params: RuleUpdateParams) => {
            const services = getGitHubServices();
            if (!services) {
                throw new Error('GitHub 토큰이 설정되지 않았습니다.');
            }
            return await services.ruleSubmission.updateRule(params);
        }
    });
}

/**
 * 규칙 삭제 Mutation
 */
export function useDeleteRuleMutation() {
    return useMutation({
        mutationFn: async (params: RuleDeleteParams) => {
            const services = getGitHubServices();
            if (!services) {
                throw new Error('GitHub 토큰이 설정되지 않았습니다.');
            }
            return await services.ruleSubmission.deleteRule(params);
        }
    });
}
