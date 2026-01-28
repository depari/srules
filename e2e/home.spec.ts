/**
 * 메인 페이지 E2E 테스트
 */

import { test, expect } from '@playwright/test';

test.describe('메인 페이지', () => {
    test('페이지가 정상적으로 로드되어야 함', async ({ page }) => {
        await page.goto('/');

        // 타이틀 확인
        await expect(page).toHaveTitle(/Smart Rules Archive/);

        // 메인 헤딩 확인
        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
    });

    test('Featured Rules가 표시되어야 함', async ({ page }) => {
        await page.goto('/');

        // Featured Rules 섹션 확인
        const featuredSection = page.locator('text=Featured Rules').or(page.locator('text=추천 규칙'));
        await expect(featuredSection).toBeVisible();

        // 규칙 카드가 표시되는지 확인
        const ruleCards = page.locator('[class*="rule-card"], [class*="rounded"]').filter({ hasText: /.*/ });
        await expect(ruleCards.first()).toBeVisible();
    });

    test('네비게이션 링크가 작동해야 함', async ({ page }) => {
        await page.goto('/');

        // 규칙 목록 링크 클릭
        const rulesLink = page.locator('a[href*="/rules"]').first();
        await rulesLink.click();

        // URL 변경 확인
        await expect(page).toHaveURL(/\/rules/);
    });

    test('언어 전환이 작동해야 함', async ({ page }) => {
        await page.goto('/ko');

        // 한국어 페이지 확인
        await expect(page).toHaveURL(/\/ko/);

        // 영어로 전환
        const langSwitcher = page.locator('a[href*="/en"]').first();
        if (await langSwitcher.isVisible()) {
            await langSwitcher.click();
            await expect(page).toHaveURL(/\/en/);
        }
    });
});
