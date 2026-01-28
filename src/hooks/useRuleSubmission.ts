/**
 * Rule Submission 커스텀 훅
 * 규칙 제출 관련 비즈니스 로직 분리
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import matter from 'gray-matter';
import { marked } from 'marked';
import { createGitHubClient } from '@/lib/github';

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
export function useRuleLoader(editSlug: string | null, setValue: any) {
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
                setValue('difficulty', data.difficulty || 'beginner');
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
export function useSectionInserter(contentValue: string | undefined, setValue: any) {
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
 * 규칙 제출 훅
 */
export function useRuleSubmission(editSlug: string | null) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [prUrl, setPrUrl] = useState<string | null>(null);

    const submitRule = async (data: RuleFormData) => {
        setIsSubmitting(true);
        try {
            const client = createGitHubClient();

            // 토큰이 없으면 Issue 생성 방식으로 전환
            if (!client) {
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
                return;
            }

            // GitHub PR 생성
            const tagsArray = data.tags.split(',').map(tag => tag.trim());
            const fileName = editSlug ? `${editSlug}.md` : `${data.title.toLowerCase().replace(/\s+/g, '-')}.md`;

            const { prUrl: url } = await client.submitRule({
                title: data.title,
                content: data.content,
                category: data.category,
                tags: tagsArray,
                author: data.author,
                difficulty: data.difficulty as any,
                fileName: `rules/${fileName}`,
                isEdit: !!editSlug
            } as any);

            setPrUrl(url);
        } catch (error) {
            console.error('Submission error:', error);
            alert('제출 중 오류가 발생했습니다.');
            throw error;
        } finally {
            setIsSubmitting(false);
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
