/**
 * 제출 성공 메시지 컴포넌트
 */

import { Link } from '@/i18n/routing';

interface SuccessMessageProps {
    prUrl: string;
    isEdit: boolean;
}

export function SuccessMessage({ prUrl, isEdit }: SuccessMessageProps) {
    const isIssue = prUrl.includes('/issues/');

    return (
        <div className="mx-auto max-w-2xl px-4 py-20">
            <div className="rounded-2xl border border-green-900/50 bg-gradient-to-br from-green-950/30 to-emerald-950/30 p-10 shadow-2xl shadow-green-500/10">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-gradient-to-br from-green-500 to-emerald-500 p-4 shadow-lg shadow-green-500/30">
                        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="mb-4 text-center text-3xl font-extrabold text-white">
                    {isIssue ? '제안서가 생성되었습니다!' : '제출이 완료되었습니다!'}
                </h2>

                {/* Description */}
                <p className="mb-8 text-center text-lg text-slate-300">
                    {isIssue
                        ? '규칙 제안서가 GitHub Issue로 생성되었습니다. Issue에서 관리자와 논의할 수 있습니다.'
                        : isEdit
                            ? '수정 요청 Pull Request가 성공적으로 생성되었습니다! 관리자가 검토한 후 병합됩니다.'
                            : '규칙 제출 Pull Request가 성공적으로 생성되었습니다! 관리자가 검토한 후 병합됩니다.'
                    }
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Link
                        href={prUrl}
                        target="_blank"
                        className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-center text-lg font-bold text-white hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/20"
                    >
                        {isIssue ? 'Issue 확인하기' : 'Pull Request 확인하기'}
                    </Link>
                    <Link
                        href="/rules"
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-4 text-center text-lg font-bold text-white hover:bg-slate-800 transition-all"
                    >
                        규칙 목록으로
                    </Link>
                </div>

                {/* Additional Info */}
                <div className="mt-8 rounded-xl bg-slate-900/50 border border-slate-800 p-5">
                    <p className="text-sm text-slate-400 leading-relaxed">
                        💡 <strong className="text-white">알려드립니다:</strong>
                        {' '}
                        {isIssue
                            ? 'GitHub 토큰을 설정하면 직접 Pull Request를 생성할 수 있습니다.'
                            : '제출하신 규칙은 관리자의 승인 후 공식 규칙으로 등록됩니다. 감사합니다!'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
