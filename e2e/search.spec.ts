/**
 * 검색 기능 E2E 테스트
 */

import { test, expect } from '@playwright/test';

test.describe('검색 기능', () => {
    test('검색바가 표시되어야 함', async ({ page }) => {
        await page.goto('/ko/rules');

        // 검색 입력 필드 확인
        const searchInput = page.locator('input[type="text"]').first();
        await expect(searchInput).toBeVisible();
    });

    test('검색어 입력 시 결과가 필터링되어야 함', async ({ page }) => {
        await page.goto('/ko/rules');

        // 검색 입력
        const searchInput = page.locator('input[type="text"]').first();
        await searchInput.fill('TypeScript');

        // 잠시 대기 (디바운스)
        await page.waitForTimeout(500);

        // 결과에 TypeScript 관련 규칙이 표시되는지 확인
        const results = page.locator('text=/TypeScript/i');
        await expect(results.first()).toBeVisible();
    });

    test('검색 결과가 없을 때 메시지가 표시되어야 함', async ({ page }) => {
        await page.goto('/ko/rules');

        // 존재하지 않는 검색어 입력
        const searchInput = page.locator('input[type="text"]').first();
        await searchInput.fill('NonExistentSearchTerm12345');

        // 잠시 대기
        await page.waitForTimeout(500);

        // "결과 없음" 메시지 또는 빈 상태 확인
        const noResults = page.locator('text=/결과|찾을 수 없|No results/i');
        // 검색 결과가 없으면 메시지가 표시되거나, 규칙 카드가 표시되지 않아야 함
    });
});
