/**
 * 규칙 액션 버튼 컴포넌트들
 * ISP (인터페이스 분리 원칙) 적용: 각 버튼이 필요한 props만 받음
 */

import { Link } from '@/i18n/routing';

/**
 * 즐겨찾기 버튼
 */
interface FavoriteButtonProps {
    favorited: boolean;
    onClick: () => void;
}

export function FavoriteButton({ favorited, onClick }: FavoriteButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${favorited
                    ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
        >
            <svg className={`h-4 w-4 ${favorited ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.07 6.323a1 1 0 00.95.69h6.642c.969 0 1.371 1.24.588 1.81l-5.378 3.908a1 1 0 00-.364 1.118l2.07 6.323c.3.921-.755 1.688-1.54 1.118l-5.378-3.908a1 1 0 00-1.175 0l-5.378 3.908c-.784.57-1.838-.197-1.539-1.118l2.07-6.323a1 1 0 00-.364-1.118L2.293 11.75c-.783-.57-.38-1.81.588-1.81h6.642a1 1 0 00.95-.69l2.07-6.323z" />
            </svg>
            {favorited ? '즐겨찾기 취소' : '즐겨찾기'}
        </button>
    );
}

/**
 * 복사 버튼
 */
interface CopyButtonProps {
    copied: boolean;
    onClick: () => void;
}

export function CopyButton({ copied, onClick }: CopyButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
        >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? '복사됨!' : '복사'}
        </button>
    );
}

/**
 * 수정 버튼
 */
interface EditButtonProps {
    slug: string;
}

export function EditButton({ slug }: EditButtonProps) {
    return (
        <Link
            href={`/submit?edit=${slug}`}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            수정
        </Link>
    );
}

/**
 * 삭제 버튼
 */
interface DeleteButtonProps {
    isDeleting: boolean;
    onClick: () => void;
}

export function DeleteButton({ isDeleting, onClick }: DeleteButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-50"
        >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {isDeleting ? '삭제 중...' : '삭제'}
        </button>
    );
}

/**
 * 다운로드 버튼
 */
interface DownloadButtonProps {
    onClick: () => void;
}

export function DownloadButton({ onClick }: DownloadButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            다운로드
        </button>
    );
}

/**
 * 공유 버튼
 */
interface ShareButtonProps {
    sharesCopied: boolean;
    onClick: () => void;
}

export function ShareButton({ sharesCopied, onClick }: ShareButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {sharesCopied ? 'URL 복사됨!' : '공유'}
        </button>
    );
}

/**
 * Divider (구분선)
 */
export function ActionsDivider() {
    return <div className="h-8 w-px bg-slate-800 mx-1 hidden sm:block"></div>;
}
