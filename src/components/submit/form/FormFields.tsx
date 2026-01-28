/**
 * 규칙 제출 폼 UI 컴포넌트들
 * ISP 원칙 적용: 각 컴포넌트가 필요한 props만 받음
 */

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { RuleFormData } from '@/hooks/useRuleSubmission';

const CATEGORIES = [
    'TypeScript', 'JavaScript', 'React', 'Vue', 'Angular', 'Next.js',
    'Python', 'Java', 'Go', 'Rust', 'C++',
    'Git', 'GitHub', 'CI/CD', 'Docker', 'Kubernetes',
    'Cursor', 'Antigravity', 'Cline', 'VS Code', 'AI', 'Prompt Engineering',
    'Testing', 'Design Patterns', 'Architecture',
];

/**
 * 제목 입력 필드
 */
interface TitleInputProps {
    register: UseFormRegister<RuleFormData>;
    error?: string;
}

export function TitleInput({ register, error }: TitleInputProps) {
    return (
        <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-cyan-400 mb-3">
                제목
            </label>
            <input
                {...register('title')}
                type="text"
                placeholder="규칙의 명확한 제목을 입력하세요"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    );
}

/**
 * 카테고리 선택 필드
 */
interface CategorySelectProps {
    selectedCategories: string[];
    toggleCategory: (category: string) => void;
    error?: string;
}

export function CategorySelect({ selectedCategories, toggleCategory, error }: CategorySelectProps) {
    return (
        <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-purple-400 mb-3">
                카테고리 (복수 선택 가능)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`rounded-lg px-4 py-3 text-sm font-bold transition-all border ${selectedCategories.includes(cat)
                                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-purple-500/50 hover:text-purple-400'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    );
}

/**
 * 태그 입력 필드
 */
interface TagsInputProps {
    register: UseFormRegister<RuleFormData>;
    error?: string;
}

export function TagsInput({ register, error }: TagsInputProps) {
    return (
        <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-pink-400 mb-3">
                태그 (쉼표로 구분)
            </label>
            <input
                {...register('tags')}
                type="text"
                placeholder="예: best practices, clean code, performance"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4 text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    );
}

/**
 * 난이도 선택 필드
 */
interface DifficultySelectProps {
    register: UseFormRegister<RuleFormData>;
    error?: string;
}

export function DifficultySelect({ register, error }: DifficultySelectProps) {
    return (
        <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-yellow-400 mb-3">
                난이도
            </label>
            <select
                {...register('difficulty')}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4 text-white focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
            >
                <option value="beginner">초급 (Beginner)</option>
                <option value="intermediate">중급 (Intermediate)</option>
                <option value="advanced">고급 (Advanced)</option>
            </select>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    );
}

/**
 * 작성자 입력 필드
 */
interface AuthorInputProps {
    register: UseFormRegister<RuleFormData>;
    error?: string;
}

export function AuthorInput({ register, error }: AuthorInputProps) {
    return (
        <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-green-400 mb-3">
                작성자
            </label>
            <input
                {...register('author')}
                type="text"
                placeholder="당신의 이름 또는 닉네임"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4 text-white placeholder-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    );
}

/**
 * 내용 에디터 필드
 */
interface ContentEditorProps {
    register: UseFormRegister<RuleFormData>;
    error?: string;
    hasOverview: boolean;
    hasExample: boolean;
    onInsertSection: (type: 'overview' | 'example') => void;
    onPreview: () => void;
}

export function ContentEditor({
    register,
    error,
    hasOverview,
    hasExample,
    onInsertSection,
    onPreview
}: ContentEditorProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold uppercase tracking-wide text-blue-400">
                    규칙 내용 (Markdown)
                </label>
                <div className="flex gap-2">
                    {!hasOverview && (
                        <button
                            type="button"
                            onClick={() => onInsertSection('overview')}
                            className="text-xs text-slate-400 hover:text-blue-400 transition-colors px-3 py-1 rounded-lg bg-slate-800/50 hover:bg-slate-800"
                        >
                            + 개요 섹션
                        </button>
                    )}
                    {!hasExample && (
                        <button
                            type="button"
                            onClick={() => onInsertSection('example')}
                            className="text-xs text-slate-400 hover:text-blue-400 transition-colors px-3 py-1 rounded-lg bg-slate-800/50 hover:bg-slate-800"
                        >
                            + 예시 섹션
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onPreview}
                        className="text-xs text-slate-400 hover:text-blue-400 transition-colors px-3 py-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 flex items-center gap-1"
                    >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        미리보기
                    </button>
                </div>
            </div>
            <textarea
                {...register('content')}
                rows={20}
                placeholder="## 규칙 설명&#10;&#10;이 규칙은...&#10;&#10;## 사용 예시&#10;&#10;```typescript&#10;// 코드 예시&#10;```"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    );
}

/**
 * 제출 버튼
 */
interface SubmitButtonProps {
    isSubmitting: boolean;
    isEdit: boolean;
}

export function SubmitButton({ isSubmitting, isEdit }: SubmitButtonProps) {
    return (
        <div className="flex gap-4">
            <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-5 text-lg font-bold text-white hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20"
            >
                {isSubmitting
                    ? '제출 중...'
                    : isEdit
                        ? '수정 제출하기'
                        : '규칙 제출하기'
                }
            </button>
        </div>
    );
}
