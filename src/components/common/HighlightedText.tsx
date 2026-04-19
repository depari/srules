'use client';

import React from 'react';

interface HighlightedTextProps {
    text: string;
    indices: readonly [number, number][] | undefined;
    highlightClassName?: string;
}

export default function HighlightedText({ text, indices, highlightClassName = "text-purple-400 font-black bg-purple-500/10 rounded-sm" }: HighlightedTextProps) {
    if (!indices || indices.length === 0) {
        return <>{text}</>;
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    // 인덱스를 정렬 (Fuse가 이미 정렬해서 주긴 하지만 안전을 위해)
    const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);

    sortedIndices.forEach(([start, end], i) => {
        // 매칭 이전의 텍스트
        if (start > lastIndex) {
            segments.push(text.substring(lastIndex, start));
        }
        
        // 매칭된 텍스트 (하이라이트)
        segments.push(
            <span key={i} className={highlightClassName}>
                {text.substring(start, end + 1)}
            </span>
        );
        
        lastIndex = end + 1;
    });

    // 남은 텍스트
    if (lastIndex < text.length) {
        segments.push(text.substring(lastIndex));
    }

    return <>{segments}</>;
}
