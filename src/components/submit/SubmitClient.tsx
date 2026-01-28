'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { Link } from '@/i18n/routing';
import { useRuleForm } from '@/hooks/useRuleSubmission';
import {
    TitleInput,
    CategorySelect,
    TagsInput,
    DifficultySelect,
    AuthorInput,
    ContentEditor,
    SubmitButton,
} from '@/components/submit/form/FormFields';
import { PreviewModal } from '@/components/submit/PreviewModal';
import { SuccessMessage } from '@/components/submit/SuccessMessage';

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
    const editSlug = searchParams.get('edit');

    const {
        form,
        contentValue,
        selectedCategories,
        preview,
        sectionInserter,
        submission,
    } = useRuleForm(editSlug);

    const { register, handleSubmit, setValue, formState: { errors } } = form;

    // 카테고리 토글 핸들러
    const toggleCategory = (category: string) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        setValue('category', newCategories);
    };

    // 폼 제출 핸들러
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        await submission.submitRule(data);
        form.reset();
    };

    // 성공 화면
    if (submission.prUrl) {
        return <SuccessMessage prUrl={submission.prUrl} isEdit={!!editSlug} />;
    }

    return (
        <div className="min-h-screen bg-slate-950 py-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-4 shadow-lg shadow-cyan-500/30">
                            <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl font-noto">
                        {editSlug ? '규칙 수정하기' : '새 규칙 제출하기'}
                    </h1>
                    <p className="mt-4 text-lg text-slate-400 font-medium">
                        {editSlug
                            ? '규칙 내용을 수정하여 Pull Request를 생성합니다.'
                            : '당신의 지식을 공유하고 개발자 커뮤니티에 기여하세요.'
                        }
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-xl">
                        <div className="space-y-8">
                            <TitleInput
                                register={register}
                                error={errors.title?.message as string}
                            />

                            <CategorySelect
                                selectedCategories={selectedCategories}
                                toggleCategory={toggleCategory}
                                error={errors.category?.message as string}
                            />

                            <TagsInput
                                register={register}
                                error={errors.tags?.message as string}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DifficultySelect
                                    register={register}
                                    error={errors.difficulty?.message as string}
                                />
                                <AuthorInput
                                    register={register}
                                    error={errors.author?.message as string}
                                />
                            </div>

                            <ContentEditor
                                register={register}
                                error={errors.content?.message as string}
                                hasOverview={sectionInserter.hasOverview}
                                hasExample={sectionInserter.hasExample}
                                onInsertSection={sectionInserter.insertSection}
                                onPreview={() => preview.generatePreview(contentValue || '')}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <SubmitButton
                        isSubmitting={submission.isSubmitting}
                        isEdit={!!editSlug}
                    />

                    {/* Back Link */}
                    <div className="text-center">
                        <Link
                            href="/rules"
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            ← 규칙 목록으로 돌아가기
                        </Link>
                    </div>
                </form>

                {/* Preview Modal */}
                <PreviewModal
                    show={preview.showPreview}
                    html={preview.preview}
                    onClose={preview.closePreview}
                />
            </div>
        </div>
    );
}
