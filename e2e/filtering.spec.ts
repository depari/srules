/**
 * 카테고리 및 태그 필터링 E2E 테스트
 */

import { test, expect } from '@playwright/test';

test.describe('카테고리 필터링', () => {
    test('카테고리 페이지가 로드되어야 함', async ({ page }) => {
        await page.goto('/ko/categories/typescript');

        // 페이지 타이틀에 카테고리 이름이 포함되어야 함
        const heading = page.locator('h1');
        await expect(heading).toContainText(/TypeScript/i);
    });

    test('카테고리별 규칙이 표시되어야 함', async ({ page }) => {
        await page.goto('/ko/categories/typescript');

        // 규칙 카드가 표시되는지 확인
        const ruleCards = page.locator('[class*="grid"] > div').filter({ hasText: /.*/ });
        const count = await ruleCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('카테고리 목록에서 카테고리 선택이 작동해야 함', async ({ page }) => {
        await page.goto('/ko/rules');

        // TypeScript 카테고리 링크 클릭
        const categoryLink = page.locator('a[href*="/categories/typescript"]').first();
        if (await categoryLink.isVisible()) {
            await categoryLink.click();

            // URL 변경 확인
            await expect(page).toHaveURL(/\/categories\/typescript/);
        }
    });
});

test.describe('태그 필터링', () => {
    test('태그 페이지가 로드되어야 함', async ({ page }) => {
        await page.goto('/ko/tags/best-practices');

        // 페이지 헤딩 확인
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
    });

    test('공백이 포함된 태그가 정상 작동해야 함', async ({ page }) => {
        // 이전에 수정한 버그: 공백 → 하이픈 변환
        await page.goto('/ko/tags/type-safety');

        // 페이지가 정상 로드되어야 함 (404 아님)
        const heading = page.locator('h1');
        await expect(heading).toContainText(/Type Safety/i);
    });

    test('태그별 규칙이 표시되어야 함', async ({ page }) => {
        await page.goto('/ko/tags/cursor');

        // 규칙 카드가 표시되는지 확인
        const ruleCards = page.locator('[class*="grid"] > div').filter({ hasText: /.*/ });
        const count = await ruleCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('인기 태그 클릭이 작동해야 함', async ({ page }) => {
        await page.goto('/ko/rules');

        // 인기 태그 섹션에서 태그 클릭
        const tagLink = page.locator('a[href*="/tags/"]').first();
        if (await tagLink.isVisible()) {
            await tagLink.click();

            // URL 변경 확인
            await expect(page).toHaveURL(/\/tags\//);
        }
    });
});
