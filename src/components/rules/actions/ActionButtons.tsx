/**
 * 규칙 액션 버튼 컴포넌트들
 * ISP (인터페이스 분리 원칙) 적용: 각 버튼이 필요한 props만 받음
 */

import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

/**
 * 전역 버튼 스타일 래퍼
 */
function ActionButtonWrapper({ children, onClick, disabled, className, active }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    disabled?: boolean; 
    className?: string;
    active?: boolean;
}) {
    return (
        <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all shadow-sm backdrop-blur-sm ${
                active 
                ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' 
                : 'border-white/5 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white'
            } disabled:opacity-50 ${className || ''}`}
        >
            {children}
        </motion.button>
    );
}

/**
 * 즐겨찾기 버튼
 */
interface FavoriteButtonProps {
    favorited: boolean;
    isLoading?: boolean;
    onClick: () => void;
}

export function FavoriteButton({ favorited, isLoading, onClick }: FavoriteButtonProps) {
    return (
        <ActionButtonWrapper 
            onClick={onClick} 
            disabled={isLoading}
            className={favorited ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 shadow-amber-500/5' : ''}
        >
            <svg className={`h-4 w-4 ${favorited ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.07 6.323a1 1 0 00.95.69h6.642c.969 0 1.371 1.24.588 1.81l-5.378 3.908a1 1 0 00-.364 1.118l2.07 6.323c.3.921-.755 1.688-1.54 1.118l-5.378-3.908a1 1 0 00-1.175 0l-5.378 3.908c-.784.57-1.838-.197-1.539-1.118l2.07-6.323a1 1 0 00-.364-1.118L2.293 11.75c-.783-.57-.38-1.81.588-1.81h6.642a1 1 0 00.95-.69l2.07-6.323z" />
            </svg>
            {isLoading ? '...' : (favorited ? '즐겨찾기 완료' : '즐겨찾기')}
        </ActionButtonWrapper>
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
        <ActionButtonWrapper 
            onClick={onClick}
            className={copied ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-violet-600/90 text-white border-violet-500/50 hover:bg-violet-600 shadow-violet-600/20'}
        >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? '복사 완료' : 'Markdown 복사'}
        </ActionButtonWrapper>
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
        <Link href={`/submit?edit=${slug}`}>
            <ActionButtonWrapper>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                수정 요청
            </ActionButtonWrapper>
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
        <ActionButtonWrapper 
            onClick={onClick} 
            disabled={isDeleting}
            className="border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/20"
        >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {isDeleting ? '삭제 요청 중...' : '삭제 요청'}
        </ActionButtonWrapper>
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
        <ActionButtonWrapper onClick={onClick}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            MD 다운로드
        </ActionButtonWrapper>
    );
}

/**
 * 이미지 저장 버튼
 */
interface ExportButtonProps {
    isLoading: boolean;
    onClick: () => void;
}

export function ExportButton({ isLoading, onClick }: ExportButtonProps) {
    return (
        <ActionButtonWrapper onClick={onClick} disabled={isLoading}>
            {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
            ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )}
            이미지로 저장
        </ActionButtonWrapper>
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
        <ActionButtonWrapper onClick={onClick} active={sharesCopied}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {sharesCopied ? 'URL 복사 완료!' : 'URL 공유'}
        </ActionButtonWrapper>
    );
}

/**
 * Divider (구분선)
 */
export function ActionsDivider() {
    return <div className="h-10 w-px bg-white/5 mx-2 hidden sm:block"></div>;
}
