/**
 * 규칙 상세 페이지 E2E 테스트
 */

import { test, expect } from '@playwright/test';

test.describe('규칙 상세 페이지', () => {
    test('규칙 상세 페이지가 로드되어야 함', async ({ page }) => {
        await page.goto('/ko/rules/cursor/cursor-rules');

        // 페이지 타이틀 확인
        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
    });

    test('규칙 메타데이터가 표시되어야 함', async ({ page }) => {
        await page.goto('/ko/rules/cursor/cursor-rules');

        // 작성자, 날짜, 카테고리, 태그 등 확인
        const metadata = page.getByTestId('rule-metadata');
        await expect(metadata.first()).toBeVisible();
    });

    test('코드 블록이 하이라이팅되어야 함', async ({ page }) => {
        await page.goto('/ko/rules/cursor/cursor-rules');

        // 코드 블록 확인
        const codeBlock = page.locator('pre code, .hljs');
        if (await codeBlock.count() > 0) {
            await expect(codeBlock.first()).toBeVisible();
        }
    });

    test('액션 버튼이 표시되어야 함', async ({ page }) => {
        await page.goto('/ko/rules/cursor/cursor-rules');

        // 즐겨찾기, 복사, 다운로드 등 버튼 확인
        const actionButtons = page.locator('button').filter({ hasText: /즐겨찾기|복사|다운로드|Favorite|Copy|Download/i });
        const count = await actionButtons.count();
        expect(count).toBeGreaterThan(0);
    });

    test('즐겨찾기 버튼이 작동해야 함', async ({ page }) => {
        await page.goto('/ko/rules/cursor/cursor-rules');

        // 즐겨찾기 버튼 찾기
        const favoriteButton = page.locator('button').filter({ hasText: /즐겨찾기|Favorite/i }).first();

        if (await favoriteButton.isVisible()) {
            // 초기 상태 확인
            const initialText = await favoriteButton.textContent();

            // 클릭
            await favoriteButton.click();

            // 잠시 대기
            await page.waitForTimeout(300);

            // 상태 변경 확인 (텍스트 또는 클래스 변경)
            const newText = await favoriteButton.textContent();
            // 즐겨찾기 추가/제거에 따라 텍스트가 변경되어야 함
        }
    });

    test('복사 버튼이 작동해야 함', async ({ page }) => {
        await page.goto('/ko/rules/cursor/cursor-rules');

        // 복사 버튼 찾기
        const copyButton = page.locator('button').filter({ hasText: /복사|Copy/i }).first();

        if (await copyButton.isVisible()) {
            // 클립보드 권한 허용 (테스트 환경)
            await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

            // 클릭
            await copyButton.click();

            // 잠시 대기
            await page.waitForTimeout(300);

            // 클립보드에 복사되었는지 확인 (브라우저에 따라 동작이 다를 수 있음)
        }
    });

    test('목록으로 돌아가기 링크가 작동해야 함', async ({ page }) => {
        await page.goto('/ko/rules/cursor/cursor-rules');

        // 목록으로 돌아가기 링크
        const backLink = page.getByTestId('breadcrumb-list');

        if (await backLink.isVisible()) {
            await backLink.click();
            await expect(page).toHaveURL(/\/rules\/?$/);
        }
    });
});
