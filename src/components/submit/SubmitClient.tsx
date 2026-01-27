'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter, routing } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
    const t = useTranslations('common');
    const searchParams = useSearchParams();
    const router = useRouter();
    const editSlug = searchParams.get('edit');

    const [preview, setPreview] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [prUrl, setPrUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<RuleFormData>({
        resolver: zodResolver(ruleSchema),
        defaultValues: {
            difficulty: 'beginner',
            category: [],
        }
    });

    const contentValue = watch('content');
    const selectedCategories = watch('category');

    // 수정 모드일 때 기존 데이터 불러오기
    useEffect(() => {
        if (editSlug) {
            fetch(`/rules/${editSlug}.md`)
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
        }
    }, [editSlug, setValue]);

    const handlePreview = async () => {
        const html = await marked.parse(contentValue || '');
        setPreview(html);
        setShowPreview(true);
    };

    const onSubmit = async (data: RuleFormData) => {
        setIsSubmitting(true);
        try {
            const client = createGitHubClient();
            if (!client) {
                alert('GitHub 토큰이 설정되지 않아 제출 기능을 사용할 수 없습니다. .env.local 파일을 확인해주세요.');
                return;
            }

            const tagsArray = data.tags.split(',').map(tag => tag.trim());
            const fileName = editSlug ? `${editSlug}.md` : `${data.title.toLowerCase().replace(/\s+/g, '-')}.md`;

            const { prUrl } = await client.submitRule({
                title: data.title,
                content: data.content,
                category: data.category,
                tags: tagsArray,
                author: data.author,
                difficulty: data.difficulty as any,
                fileName: `rules/${fileName}`,
                isEdit: !!editSlug
            } as any);

            setPrUrl(prUrl);
            reset();
        } catch (error) {
            console.error('Submission error:', error);
            alert('제출 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const insertSection = (type: 'overview' | 'example') => {
        const sections = {
            overview: '\n## 개요\n\n이 규칙은 ...를 위한 것입니다.\n',
            example: '\n## 예시\n\n```typescript\n// 좋은 예시\nfunction good() {\n  // ...\n}\n\n// 좋지 않은 예시\nfunction bad() {\n  // ...\n}\n```\n'
        };
        setValue('content', (contentValue || '') + sections[type]);
    };

    const hasOverview = contentValue?.includes('## 개요');
    const hasExample = contentValue?.includes('## 예시');

    if (prUrl) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <div className="mb-8 flex justify-center">
                    <div className="rounded-full bg-green-500/10 p-4 text-green-500 shadow-lg shadow-green-500/20">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4 font-noto">제출이 완료되었습니다!</h1>
                <p className="text-slate-400 mb-8 font-medium font-noto">
                    규칙 제안이 GitHub Pull Request로 생성되었습니다. 검토 후 아카이브에 반영될 예정입니다.
                </p>
                <div className="flex flex-col gap-4">
                    <a
                        href={prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-purple-600 px-8 py-4 font-bold text-white hover:bg-purple-700 transition-all font-mono text-sm shadow-xl shadow-purple-900/40 hover:-translate-y-1"
                    >
                        {prUrl}
                    </a>
                    <button
                        onClick={() => {
                            setPrUrl(null);
                            router.push('/');
                        }}
                        className="mt-4 text-slate-500 hover:text-white transition-colors text-sm font-black uppercase tracking-widest font-noto"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-4 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent font-noto tracking-tighter">
                        {editSlug ? '규칙 수정 요청' : '새로운 규칙 등록'}
                    </h1>
                    <p className="text-lg text-slate-400 font-medium leading-relaxed font-noto">
                        당신의 노하우를 공유해주세요. 마크다운 형식을 사용하여 규칙을 작성할 수 있습니다.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-8 sm:grid-cols-2">
                        {/* Title */}
                        <div className="sm:col-span-2">
                            <label htmlFor="title" className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.3em]">
                                제목
                            </label>
                            <input
                                {...register('title')}
                                id="title"
                                type="text"
                                className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-4 text-white placeholder-slate-600 focus:border-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all font-bold shadow-inner"
                                placeholder="예: React 컴포넌트 생명주기 베스트 프랙티스"
                            />
                            {errors.title && (
                                <p className="mt-2 text-xs text-rose-400 font-bold px-2 uppercase tracking-tighter">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Author */}
                        <div>
                            <label htmlFor="author" className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.3em]">
                                작성자
                            </label>
                            <input
                                {...register('author')}
                                id="author"
                                type="text"
                                className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-4 text-white placeholder-slate-600 focus:border-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all font-bold shadow-inner"
                                placeholder="당신의 닉네임"
                            />
                            {errors.author && (
                                <p className="mt-2 text-xs text-rose-400 font-bold px-2 uppercase tracking-tighter">{errors.author.message}</p>
                            )}
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label htmlFor="difficulty" className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.3em]">
                                난이도
                            </label>
                            <select
                                {...register('difficulty')}
                                id="difficulty"
                                className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-4 text-white focus:border-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all font-bold shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1.5rem_center] bg-no-repeat"
                            >
                                <option value="beginner">Beginner (입문)</option>
                                <option value="intermediate">Intermediate (중급)</option>
                                <option value="advanced">Advanced (고급)</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div className="sm:col-span-2">
                            <label className="block text-[10px] font-black text-slate-500 mb-4 uppercase tracking-[0.3em]">
                                카테고리 (복수 선택 가능)
                            </label>
                            <div className="flex flex-wrap gap-2.5 p-6 rounded-3xl border border-slate-800 bg-slate-900/20 shadow-inner">
                                {CATEGORIES.map((cat) => (
                                    <label
                                        key={cat}
                                        className={`cursor-pointer rounded-xl border px-5 py-2.5 text-xs font-black transition-all uppercase tracking-widest ${selectedCategories?.includes(cat)
                                            ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/10'
                                            : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            value={cat}
                                            {...register('category')}
                                        />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                            {errors.category && (
                                <p className="mt-2 text-xs text-rose-400 font-bold px-2 uppercase tracking-tighter">{errors.category.message}</p>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="sm:col-span-2">
                            <label htmlFor="tags" className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.3em]">
                                태그 (쉼표로 구분)
                            </label>
                            <input
                                {...register('tags')}
                                id="tags"
                                type="text"
                                className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-4 text-white placeholder-slate-600 focus:border-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all font-bold shadow-inner font-mono"
                                placeholder="예: clean-code, perf, security"
                            />
                            {errors.tags && (
                                <p className="mt-2 text-xs text-rose-400 font-bold px-2 uppercase tracking-tighter">{errors.tags.message}</p>
                            )}
                        </div>

                        {/* Content */}
                        <div className="sm:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <label htmlFor="content" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                    규칙 내용 (Markdown)
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
                                        <button
                                            type="button"
                                            onClick={() => !hasOverview && insertSection('overview')}
                                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${hasOverview ? 'text-emerald-400' : 'text-slate-500 hover:text-indigo-400'}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${hasOverview ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-slate-700'}`}></span>
                                            OVERVIEW {hasOverview ? '✓' : '+'}
                                        </button>
                                        <div className="w-px h-3 bg-slate-800"></div>
                                        <button
                                            type="button"
                                            onClick={() => !hasExample && insertSection('example')}
                                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${hasExample ? 'text-emerald-400' : 'text-slate-500 hover:text-indigo-400'}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${hasExample ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-slate-700'}`}></span>
                                            EXAMPLE {hasExample ? '✓' : '+'}
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handlePreview}
                                        className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-[0.2em] px-5 py-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 shadow-sm"
                                    >
                                        미리보기
                                    </button>
                                </div>
                            </div>

                            <div className="relative group">
                                <textarea
                                    {...register('content')}
                                    id="content"
                                    rows={20}
                                    className="w-full rounded-3xl border border-slate-800 bg-slate-900/50 px-8 py-6 text-white placeholder-slate-700 focus:border-indigo-500/50 focus:outline-none focus:ring-8 focus:ring-indigo-500/5 font-mono text-sm leading-relaxed transition-all shadow-inner"
                                    placeholder="# 규칙 제목\n\n## 개요\n여기에 설명을 입력하세요..."
                                />
                            </div>
                            {errors.content && (
                                <p className="mt-2 text-xs text-rose-400 font-bold px-2 uppercase tracking-tighter">{errors.content.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-10">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] px-8 py-5 font-black text-white hover:bg-[100%_center] focus:outline-none focus:ring-8 focus:ring-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-indigo-900/40 hover:-translate-y-1 active:scale-[0.98] text-lg uppercase tracking-widest"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-4">
                                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    제출 중...
                                </span>
                            ) : (editSlug ? '수정 요청 제출하기' : '새로운 규칙 등록하기')}
                        </button>
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/50 px-8 py-5 font-black text-slate-500 hover:text-white hover:bg-slate-800 transition-all hover:border-slate-700 uppercase tracking-widest text-sm"
                        >
                            {t('reset')}
                        </button>
                    </div>
                </form>

                {/* Preview Modal */}
                {showPreview && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setShowPreview(false)}></div>
                        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] border border-slate-700/50 bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-scale-in">
                            <div className="flex items-center justify-between border-b border-slate-800/50 p-8 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                    <span className="text-indigo-400">Preview</span> 아카이브 미리보기
                                </h2>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="rounded-2xl p-3 text-slate-500 hover:bg-slate-800 hover:text-white transition-all shadow-inner"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="overflow-y-auto p-12 max-h-[calc(90vh-100px)] scrollbar-hide">
                                <article
                                    className="prose prose-invert prose-slate max-w-none 
                                    prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter
                                    prose-p:text-slate-300 prose-p:leading-relaxed font-noto
                                    prose-a:text-indigo-400 font-medium"
                                    dangerouslySetInnerHTML={{ __html: preview }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
