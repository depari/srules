import { useState, useEffect } from 'react';

/**
 * 값 변경 디바운스 훅
 * @param value 관찰할 값
 * @param delay 지연 시간 (ms)
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
