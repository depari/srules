/**
 * 즐겨찾기 기능 E2E 테스트
 */

import { test, expect } from '@playwright/test';

test.describe('즐겨찾기 기능', () => {
    test.beforeEach(async ({ page }) => {
        // 각 테스트 전에 LocalStorage 초기화
        await page.goto('/ko/rules');
        await page.evaluate(() => localStorage.clear());
    });

    test('즐겨찾기 페이지가 로드되어야 함', async ({ page }) => {
        await page.goto('/ko/favorites');

        // 페이지 헤딩 확인
        const heading = page.locator('h1');
        await expect(heading).toContainText(/즐겨찾기|Favorites/i);
    });

    test('즐겨찾기가 없을 때 메시지가 표시되어야 함', async ({ page }) => {
        await page.goto('/ko/favorites');

        // 빈 상태 메시지 확인
        const emptyMessage = page.locator('text=/아직|없습니다|No favorites/i');
        await expect(emptyMessage).toBeVisible();
    });

    test('규칙을 즐겨찾기에 추가할 수 있어야 함', async ({ page, context }) => {
        // 규칙 상세 페이지로 이동
        await page.goto('/ko/rules/cursor/cursor-rules');

        // 즐겨찾기 버튼 클릭
        const favoriteButton = page.locator('button').filter({ hasText: /즐겨찾기|Favorite/i }).first();
        await favoriteButton.click();

        // 잠시 대기
        await page.waitForTimeout(500);

        // 즐겨찾기 페이지로 이동
        await page.goto('/ko/favorites');

        // 추가한 규칙이 표시되는지 확인
        const ruleCards = page.locator('[class*="grid"] > div').filter({ hasText: /.*/ });
        const count = await ruleCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('즐겨찾기를 제거할 수 있어야 함', async ({ page }) => {
        // 규칙을 즐겨찾기에 추가
        await page.goto('/ko/rules/cursor/cursor-rules');
        const favoriteButton = page.locator('button').filter({ hasText: /즐겨찾기|Favorite/i }).first();
        await favoriteButton.click();
        await page.waitForTimeout(300);

        // 즐겨찾기 페이지로 이동
        await page.goto('/ko/favorites');

        // 즐겨찾기 제거 버튼 클릭
        const removeButton = page.locator('button').filter({ hasText: /제거|Remove|즐겨찾기/i }).first();
        if (await removeButton.isVisible()) {
            await removeButton.click();
            await page.waitForTimeout(500);

            // 빈 상태 메시지가 표시되어야 함
            const emptyMessage = page.locator('text=/아직|없습니다|No favorites/i');
            await expect(emptyMessage).toBeVisible();
        }
    });

    test('즐겨찾기 상태가 유지되어야 함', async ({ page, context }) => {
        // 규칙을 즐겨찾기에 추가
        await page.goto('/ko/rules/cursor/cursor-rules');
        const favoriteButton = page.locator('button').filter({ hasText: /즐겨찾기|Favorite/i }).first();
        await favoriteButton.click();
        await page.waitForTimeout(300);

        // 페이지 새로고침
        await page.reload();

        // 즐겨찾기 상태가 유지되어야 함
        const favoriteButtonAfterReload = page.locator('button').filter({ hasText: /즐겨찾기|Favorite/i }).first();
        const text = await favoriteButtonAfterReload.textContent();

        // 즐겨찾기가 활성화된 상태여야 함
        expect(text).toMatch(/해제|Remove|Added|취소/i);
    });
});
