'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import matter from 'gray-matter';
import { marked } from '@/lib/markdown';
import { createGitHubClient } from '@/lib/github';

// Validation Schema
const ruleSchema = z.object({
    title: z.string().min(5, '제목은 최소 5자 이상이어야 합니다').max(100, '제목은 100자를 초과할 수 없습니다'),
    category: z.array(z.string()).min(1, '최소 1개의 카테고리를 선택해야 합니다'),
    tags: z.string().min(1, '태그는 필수입니다'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    author: z.string().min(2, '작성자 이름은 필수입니다'),
    content: z.string().min(50, '규칙 내용은 최소 50자 이상이어야 합니다'),
});

type RuleFormData = z.infer<typeof ruleSchema>;

const CATEGORIES = [
    'TypeScript', 'JavaScript', 'React', 'Vue', 'Angular', 'Next.js',
    'Python', 'Java', 'Go', 'Rust', 'C++',
    'Git', 'GitHub', 'CI/CD', 'Docker', 'Kubernetes',
    'Cursor', 'Antigravity', 'Cline', 'VS Code', 'AI', 'Prompt Engineering',
    'Testing', 'Design Patterns', 'Architecture',
];

export default function SubmitPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
            </div>
        }>
            <SubmitForm />
        </Suspense>
    );
}

function SubmitForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editSlug = searchParams.get('edit');

    const [preview, setPreview] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [prUrl, setPrUrl] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const [isLoadingEdit, setIsLoadingEdit] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
        reset,
    } = useForm<RuleFormData>({
        resolver: zodResolver(ruleSchema),
        defaultValues: {
            category: [],
            difficulty: 'beginner',
        },
    });

    // 수정 모드: 데이터 로드
    useEffect(() => {
        if (!editSlug) return;

        const loadRuleData = async () => {
            setIsLoadingEdit(true);
            try {
                const github = createGitHubClient();
                if (!github) throw new Error('GitHub token missing');

                const { content: rawContent } = await github.getFileInfo(`rules/${editSlug}.md`);
                const { data: frontmatter, content: body } = matter(rawContent);

                // 폼 값 채우기
                setValue('title', frontmatter.title || '');
                setValue('author', frontmatter.author || '');
                setValue('difficulty', frontmatter.difficulty || 'beginner');
                setValue('category', Array.isArray(frontmatter.category) ? frontmatter.category : []);
                setValue('tags', Array.isArray(frontmatter.tags) ? frontmatter.tags.join(', ') : '');
                setValue('content', body.trim());
            } catch (error) {
                console.error('Failed to load edit data:', error);
                alert('수정할 데이터를 불러오는데 실패했습니다.');
                router.push('/submit');
            } finally {
                setIsLoadingEdit(false);
            }
        };

        loadRuleData();
    }, [editSlug, setValue, router]);

    const contentValue = watch('content') || '';
    const hasOverview = contentValue.includes('## 개요');
    const hasExample = contentValue.includes('## 예시');

    const insertSection = (section: 'overview' | 'example') => {
        const currentVal = getValues('content') || '';
        const templates = {
            overview: '## 개요\n\n이 규칙의 목적과 배경에 대해 설명해주세요.\n\n',
            example: '## 예시\n\n좋은 예시와 나쁜 예시를 코드로 보여주세요.\n\n```typescript\n// Good Case\n\n// Bad Case\n```\n\n'
        };

        const template = templates[section];
        const newVal = currentVal + (currentVal.length > 0 && !currentVal.endsWith('\n\n') ? (currentVal.endsWith('\n') ? '\n' : '\n\n') : '') + template;

        setValue('content', newVal, { shouldValidate: true });
    };

    // 미리보기 생성
    const handlePreview = async () => {
        if (contentValue) {
            const html = await marked.parse(contentValue);
            setPreview(html);
            setShowPreview(true);
        }
    };

    // 폼 제출
    const onSubmit = async (data: RuleFormData) => {
        // 간단한 콘텐츠 구조 검증
        if (!data.content.includes('## 개요') || !data.content.includes('## 예시')) {
            alert('규칙 내용에 "## 개요"와 "## 예시" 섹션이 포함되어야 합니다.');
            return;
        }

        setIsSubmitting(true);
        setPrUrl('');

        try {
            // 태그를 배열로 변환
            const tags = data.tags.split(',').map(tag => tag.trim()).filter(Boolean);

            // GitHub API 클라이언트 생성
            const github = createGitHubClient();

            if (github) {
                let result;
                if (editSlug) {
                    // 규칙 수정
                    result = await github.updateRule({
                        title: data.title,
                        content: data.content,
                        category: data.category,
                        tags: tags,
                        difficulty: data.difficulty,
                        author: data.author,
                        originalPath: `rules/${editSlug}.md`
                    });
                } else {
                    // 새 규칙 제출
                    result = await github.submitRule({
                        title: data.title,
                        content: data.content,
                        category: data.category,
                        tags: tags,
                        difficulty: data.difficulty,
                        author: data.author,
                    });
                }

                setPrUrl(result.prUrl);
                setSubmitSuccess(true);

                if (!editSlug) {
                    reset();
                }

                // 10초 후 성공 메시지 숨기기
                setTimeout(() => {
                    setSubmitSuccess(false);
                    setPrUrl('');
                }, 10000);
            } else {
                // GitHub token이 없는 경우 콘솔에 출력 (Test mode)
                alert('테스트 모드: 브라우저 콘솔에서 결과를 확인하세요.');
                console.log('Submitted Data:', data);
                setSubmitSuccess(true);
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('제출 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-12">

            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                {isLoadingEdit ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mb-4"></div>
                        <p className="text-slate-400">수정할 데이터를 불러오는 중...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold">{editSlug ? '규칙 수정' : '새 규칙 등록'}</h1>
                            <p className="mt-2 text-slate-400">
                                {editSlug ? '규칙의 내용을 보완하고 업데이트를 요청하세요' : '커뮤니티와 공유하고 싶은 규칙을 등록해주세요'}
                            </p>
                        </div>

                        {/* Success Message */}
                        {submitSuccess && (
                            <div className="mb-6 rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                                <p className="text-green-400 font-semibold">
                                    ✅ 규칙이 성공적으로 제출되었습니다!
                                </p>
                                {prUrl ? (
                                    <p className="mt-2 text-slate-300">
                                        Pull Request가 생성되었습니다:{' '}
                                        <a
                                            href={prUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-cyan-400 underline hover:text-cyan-300"
                                        >
                                            {prUrl}
                                        </a>
                                    </p>
                                ) : (
                                    <p className="mt-2 text-slate-400">
                                        관리자 검토 후 곧 게시됩니다.
                                    </p>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-2">
                                    제목 <span className="text-red-400">*</span>
                                </label>
                                <input
                                    {...register('title')}
                                    type="text"
                                    id="title"
                                    placeholder="예: TypeScript 엄격 모드 Best Practices"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-slate-200">
                                        카테고리 <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative w-48">
                                        <input
                                            type="text"
                                            placeholder="카테고리 검색..."
                                            onChange={(e) => setCategorySearch(e.target.value)}
                                            className="w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                    {CATEGORIES.filter(cat =>
                                        cat.toLowerCase().includes(categorySearch.toLowerCase())
                                    ).map((cat) => (
                                        <label key={cat} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 cursor-pointer hover:border-purple-500 transition-colors">
                                            <input
                                                {...register('category')}
                                                type="checkbox"
                                                value={cat}
                                                className="rounded border-slate-600 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-slate-300">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
                                )}
                            </div>

                            {/* Tags */}
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-slate-200 mb-2">
                                    태그 <span className="text-red-400">*</span>
                                </label>
                                <input
                                    {...register('tags')}
                                    type="text"
                                    id="tags"
                                    placeholder="쉼표로 구분하여 입력 (예: TypeScript, Best Practices, Strict Mode)"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                />
                                {errors.tags && (
                                    <p className="mt-1 text-sm text-red-400">{errors.tags.message}</p>
                                )}
                            </div>

                            {/* Difficulty */}
                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-2">
                                    난이도 <span className="text-red-400">*</span>
                                </label>
                                <div className="flex gap-4">
                                    {[
                                        { value: 'beginner', label: '초급', color: 'text-green-400' },
                                        { value: 'intermediate', label: '중급', color: 'text-yellow-400' },
                                        { value: 'advanced', label: '고급', color: 'text-red-400' },
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                {...register('difficulty')}
                                                type="radio"
                                                value={option.value}
                                                className="border-slate-600 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className={`text-sm font-medium ${option.color}`}>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Author */}
                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-slate-200 mb-2">
                                    작성자 <span className="text-red-400">*</span>
                                </label>
                                <input
                                    {...register('author')}
                                    type="text"
                                    id="author"
                                    placeholder="이름 또는 GitHub 아이디"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                />
                                {errors.author && (
                                    <p className="mt-1 text-sm text-red-400">{errors.author.message}</p>
                                )}
                            </div>

                            {/* Content */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label htmlFor="content" className="block text-sm font-medium text-slate-200">
                                        규칙 내용 (Markdown) <span className="text-red-400">*</span>
                                    </label>
                                    <div className="flex items-center gap-3">
                                        {/* 스마트 툴바 / 자동 완성 힌트 */}
                                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                                            <button
                                                type="button"
                                                onClick={() => !hasOverview && insertSection('overview')}
                                                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${hasOverview ? 'text-green-400' : 'text-slate-400 hover:text-purple-400'}`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${hasOverview ? 'bg-green-400' : 'bg-slate-600'}`}></span>
                                                개요 {hasOverview ? '✓' : '(추가하기)'}
                                            </button>
                                            <div className="w-px h-3 bg-slate-700"></div>
                                            <button
                                                type="button"
                                                onClick={() => !hasExample && insertSection('example')}
                                                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${hasExample ? 'text-green-400' : 'text-slate-400 hover:text-purple-400'}`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${hasExample ? 'bg-green-400' : 'bg-slate-600'}`}></span>
                                                예시 {hasExample ? '✓' : '(추가하기)'}
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handlePreview}
                                            className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                                        >
                                            미리보기
                                        </button>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <textarea
                                        {...register('content')}
                                        id="content"
                                        rows={15}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-mono text-sm leading-relaxed"
                                    />

                                    {/* 자동 완성 힌트 및 서식 가이드 오버레이 (비었을 때) */}
                                    {!contentValue && (
                                        <div className="absolute top-4 left-4 pointer-events-none space-y-4">
                                            <div className="text-slate-500 font-mono text-sm leading-relaxed opacity-60">
                                                <p># 규칙 제목</p>
                                                <br />
                                                <p>## 개요</p>
                                                <p className="italic text-slate-600 ml-4">// 규칙에 대한 설명을 작성하세요.</p>
                                                <br />
                                                <p>## 예시</p>
                                                <p className="italic text-slate-600 ml-4">// 코드 예시를 포함해주세요.</p>
                                            </div>
                                            <div className="pt-2 border-t border-slate-800/50">
                                                <p className="text-purple-400/80 italic text-sm flex items-center gap-2">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    상단의 툴바 버튼을 눌러 필수 섹션을 자동으로 구성할 수 있습니다.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.content && (
                                    <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:from-purple-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmitting ? '제출 중...' : (editSlug ? '수정 요청 제출' : '규칙 제출')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                                >
                                    초기화
                                </button>
                            </div>
                        </form>

                        {/* Preview Modal */}
                        {showPreview && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="w-full max-w-4xl max-h-[90vh] overflow-auto rounded-lg border border-slate-700 bg-slate-900 p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-2xl font-bold">미리보기</h2>
                                        <button
                                            onClick={() => setShowPreview(false)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <article
                                        className="prose prose-invert prose-slate max-w-none"
                                        dangerouslySetInnerHTML={{ __html: preview }}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
