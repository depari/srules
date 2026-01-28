/**
 * Rule Submission 커스텀 훅
 * 규칙 제출 관련 비즈니스 로직 분리
 * React Query Mutation 적용
 */

import { useState, useEffect } from 'react';
import { useForm, UseFormSetValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import matter from 'gray-matter';
import { marked } from 'marked';
import { useSubmitRuleMutation, useUpdateRuleMutation } from '@/hooks/queries/useGitHubQueries';

// 폼 스키마
export const ruleSchema = z.object({
    title: z.string().min(5, '제목은 최소 5자 이상이어야 합니다'),
    category: z.array(z.string()).min(1, '카테고리를 최소 1개 선택해주세요'),
    tags: z.string().min(2, '태그를 입력해주세요 (쉼표로 구분)'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    author: z.string().min(2, '작성자 이름은 필수입니다'),
    content: z.string().min(50, '규칙 내용은 최소 50자 이상이어야 합니다'),
});

export type RuleFormData = z.infer<typeof ruleSchema>;

/**
 * 규칙 데이터 로드 훅
 */
export function useRuleLoader(editSlug: string | null, setValue: UseFormSetValue<RuleFormData>) {
    useEffect(() => {
        if (!editSlug) return;

        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        fetch(`${basePath}/rules/${editSlug}.md`)
            .then(res => {
                if (!res.ok) throw new Error('Rule not found');
                return res.text();
            })
            .then(text => {
                const { data, content } = matter(text);
                setValue('title', data.title || '');
                setValue('author', data.author || '');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setValue('difficulty', (data.difficulty || 'beginner') as any);
                setValue('category', data.category || []);
                setValue('tags', (data.tags || []).join(', '));
                setValue('content', content || '');
            })
            .catch(err => {
                console.error('Failed to load rule for editing:', err);
                alert('수정할 규칙을 불러오지 못했습니다.');
            });
    }, [editSlug, setValue]);
}

/**
 * 마크다운 미리보기 훅
 */
export function useMarkdownPreview() {
    const [preview, setPreview] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const generatePreview = async (content: string) => {
        const html = await marked.parse(content || '');
        setPreview(html);
        setShowPreview(true);
    };

    const closePreview = () => setShowPreview(false);

    return { preview, showPreview, generatePreview, closePreview };
}

/**
 * 섹션 삽입 훅
 */
export function useSectionInserter(contentValue: string | undefined, setValue: UseFormSetValue<RuleFormData>) {
    const insertSection = (type: 'overview' | 'example') => {
        const sections = {
            overview: '\n## 개요\n\n이 규칙은 ...를 위한 것입니다.\n',
            example: '\n## 예시\n\n```typescript\n// 좋은 예시\nfunction good() {\n  // ...\n}\n\n// 좋지 않은 예시\nfunction bad() {\n  // ...\n}\n```\n'
        };
        setValue('content', (contentValue || '') + sections[type]);
    };

    const hasOverview = contentValue?.includes('## 개요') || false;
    const hasExample = contentValue?.includes('## 예시') || false;

    return { insertSection, hasOverview, hasExample };
}

/**
 * 규칙 제출 훅 (React Query 적용)
 */
export function useRuleSubmission(editSlug: string | null) {
    const [prUrl, setPrUrl] = useState<string | null>(null);
    const [isFallbackSubmitting, setIsFallbackSubmitting] = useState(false); // 토큰 없을 때 로딩 상태

    // React Query Mutations
    const submitMutation = useSubmitRuleMutation();
    const updateMutation = useUpdateRuleMutation();

    // 전체 로딩 상태
    const isSubmitting = submitMutation.isPending || updateMutation.isPending || isFallbackSubmitting;

    const submitRule = async (data: RuleFormData) => {
        try {
            // 토큰이 없으면 Issue 생성 방식으로 전환 (Fallback)
            const hasToken = !!process.env.NEXT_PUBLIC_GITHUB_TOKEN;

            if (!hasToken) {
                setIsFallbackSubmitting(true);
                // 기존 Issue 생성 로직 유지
                const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'depari';
                const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'srules';

                const titleEncoded = encodeURIComponent(editSlug
                    ? `[Update] ${data.title}`
                    : `[Proposal] ${data.title}`
                );

                const bodyContent = `
## 규칙 제안서

**제목**: ${data.title}
**카테고리**: ${data.category.join(', ')}
**태그**: ${data.tags}
**난이도**: ${data.difficulty}
**작성자**: ${data.author}

### 제안 내용
\`\`\`markdown
${data.content}
\`\`\`

---
*이 이슈는 srules 웹사이트에서 생성되었습니다.*
`.trim();

                const bodyEncoded = encodeURIComponent(bodyContent);
                const issueUrl = `https://github.com/${owner}/${repo}/issues/new?title=${titleEncoded}&body=${bodyEncoded}&labels=rule-proposal`;

                window.open(issueUrl, '_blank');
                setPrUrl(issueUrl);
                setIsFallbackSubmitting(false); // 로딩 종료
                return;
            }

            // GitHub PR 생성 (Mutation 사용)
            const tagsArray = data.tags.split(',').map(tag => tag.trim());
            // editSlug가 있으면 파일명 유지, 없으면 제목으로 생성. 단 finalFileName에는 경로 포함
            let finalFileName = '';
            if (editSlug) {
                // editSlug는 'typescript/strict-mode' 같은 경로일 수 있음. 이미 .md가 없을 것임.
                finalFileName = `rules/${editSlug}.md`;
            } else {
                // 새 파일: rules/category/title-slug.md (카테고리 폴더링 적용 권장)
                // 하지만 기존 로직은 `rules/${data.title...}.md`로 루트에 뒀을 수도 있음.
                // README 예시는 `rules/typescript/strict-mode.md` 이므로 카테고리 포함이 맞음.
                // 기존 코드는 `rules/${fileName}` 이었고 fileName은 title slug. 즉 rules/title.md 였음.
                // 아키텍처 예시는 rules/category/file.md 임.
                // Phase 2-2 리팩토링 전 코드를 참고해 최대한 기존 동작 유지.
                // "rules/" prefix는 서비스가 아니라 클라이언트가 결정했음.
                // 여기서는 기존 로직대로 `rules/${slug}.md` 로 하되, slug 생성 시 카테고리 포함 여부는 기존대로(제목기반) 갈지, 개선할지 결정.
                // 기존대로 제목 기반으로 가되, 규칙 정리 시 폴더링은 수동으로 하는 구조인듯.
                finalFileName = `rules/${data.title.toLowerCase().replace(/\s+/g, '-')}.md`;
            }

            const commonParams = {
                title: data.title,
                content: data.content,
                category: data.category,
                tags: tagsArray,
                author: data.author,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                difficulty: data.difficulty as any,
                fileName: finalFileName,
            };

            let result;
            if (editSlug) {
                // 수정
                result = await updateMutation.mutateAsync({
                    ...commonParams,
                    originalPath: `rules/${editSlug}.md`,
                    isEdit: true
                });
            } else {
                // 생성
                result = await submitMutation.mutateAsync({
                    ...commonParams,
                    isEdit: false
                });
            }

            setPrUrl(result.prUrl);
        } catch (error) {
            console.error('Submission error:', error);
            alert('제출 중 오류가 발생했습니다.');
            // Mutation 에러는 여기서 catch됨
        }
    };

    return { isSubmitting, prUrl, submitRule };
}

/**
 * 규칙 폼 훅 (전체 통합)
 */
export function useRuleForm(editSlug: string | null) {
    const form = useForm<RuleFormData>({
        resolver: zodResolver(ruleSchema),
        defaultValues: {
            difficulty: 'beginner',
            category: [],
        }
    });

    const contentValue = form.watch('content');
    const selectedCategories = form.watch('category');

    // 데이터 로드
    useRuleLoader(editSlug, form.setValue);

    // 미리보기
    const preview = useMarkdownPreview();

    // 섹션 삽입
    const sectionInserter = useSectionInserter(contentValue, form.setValue);

    // 제출
    const submission = useRuleSubmission(editSlug);

    return {
        form,
        contentValue,
        selectedCategories,
        preview,
        sectionInserter,
        submission,
    };
}
