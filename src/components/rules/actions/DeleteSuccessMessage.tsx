/**
 * 삭제 성공 메시지 컴포넌트
 */

import { Link } from '@/i18n/routing';

interface DeleteSuccessMessageProps {
    prUrl: string;
}

export function DeleteSuccessMessage({ prUrl }: DeleteSuccessMessageProps) {
    return (
        <div className="mb-8 rounded-lg bg-red-500/10 border border-red-500/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-medium text-white">삭제 요청이 생성되었습니다</p>
                    <p className="text-xs text-slate-400">관리자가 PR을 검토한 후 삭제가 완료됩니다.</p>
                </div>
            </div>
            <Link
                href={prUrl}
                target="_blank"
                className="w-full sm:w-auto text-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
                PR 확인하기
            </Link>
        </div>
    );
}
