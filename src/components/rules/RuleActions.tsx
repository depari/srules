'use client';

import { useCopyRule, useDownloadRule, useShareRule, useFavoriteRule, useDeleteRule, useExportImage } from '@/hooks/useRuleActions';
import { DeleteSuccessMessage } from './actions/DeleteSuccessMessage';
import {
    FavoriteButton,
    CopyButton,
    EditButton,
    DeleteButton,
    DownloadButton,
    ShareButton,
    ExportButton,
    ActionsDivider,
} from './actions/ActionButtons';
import { RefObject } from 'react';

interface RuleActionsProps {
    content: string;
    slug: string;
    title: string;
    author?: string;
    category: string[];
    difficulty?: string;
    excerpt?: string;
    created: string;
    tags: string[];
    contentRef: RefObject<HTMLDivElement | null>;
}

export default function RuleActions({
    content,
    slug,
    title,
    author,
    category,
    difficulty,
    excerpt,
    created,
    tags,
    contentRef
}: RuleActionsProps) {
    // 각 액션의 로직을 독립적인 훅으로 분리
    const { copied, copy } = useCopyRule(content);
    const { download } = useDownloadRule(slug, content);
    const { sharesCopied, copyUrl } = useShareRule();
    const { isExporting, exportImage } = useExportImage(contentRef, slug.replace(/\//g, '-'));

    const { favorited, toggleFavorite, isLoading } = useFavoriteRule(slug, {
        slug,
        title,
        category,
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced' | undefined,
        excerpt: excerpt || '',
        created,
        tags,
        author: author || 'Anonymous'
    });

    const { isDeleting, deletePrUrl, deleteRule } = useDeleteRule({
        slug,
        title,
        author: author || 'Anonymous'
    });

    // 삭제 액션 핸들러
    const handleDelete = async () => {
        await deleteRule();
    };

    // 삭제 성공 메시지 표시
    if (deletePrUrl) {
        return <DeleteSuccessMessage prUrl={deletePrUrl} />;
    }

    // 액션 버튼들
    return (
        <div className="mb-8 flex flex-wrap gap-3">
            <FavoriteButton favorited={favorited} isLoading={isLoading} onClick={toggleFavorite} />
            <CopyButton copied={copied} onClick={copy} />
            <EditButton slug={slug} />
            <DeleteButton isDeleting={isDeleting} onClick={handleDelete} />
            <ActionsDivider />
            <DownloadButton onClick={download} />
            <ExportButton isLoading={isExporting} onClick={exportImage} />
            <ShareButton sharesCopied={sharesCopied} onClick={copyUrl} />
        </div>
    );
}
