/**
 * 규칙 제출 폼 E2E 테스트
 */

import { test, expect } from '@playwright/test';

test.describe('규칙 제출 폼', () => {
    test('제출 페이지가 로드되어야 함', async ({ page }) => {
        await page.goto('/ko/submit');

        // 페이지 헤딩 확인
        const heading = page.locator('h1');
        await expect(heading).toContainText(/제출|Submit/i);
    });

    test('모든 폼 필드가 표시되어야 함', async ({ page }) => {
        await page.goto('/ko/submit');

        // 제목 입력
        const titleInput = page.locator('input[name="title"]');
        await expect(titleInput).toBeVisible();

        // 태그 입력
        const tagsInput = page.locator('input[name="tags"]');
        await expect(tagsInput).toBeVisible();

        // 난이도 선택
        const difficultySelect = page.locator('select[name="difficulty"]');
        await expect(difficultySelect).toBeVisible();

        // 작성자 입력
        const authorInput = page.locator('input[name="author"]');
        await expect(authorInput).toBeVisible();

        // 내용 입력
        const contentTextarea = page.locator('textarea[name="content"]');
        await expect(contentTextarea).toBeVisible();
    });

    test('카테고리 선택이 작동해야 함', async ({ page }) => {
        await page.goto('/ko/submit');

        // 카테고리 버튼 찾기
        const categoryButtons = page.locator('button').filter({ hasText: /TypeScript|React|Cursor/i });
        const count = await categoryButtons.count();

        if (count > 0) {
            const firstButton = categoryButtons.first();

            // 클릭 전 상태
            const initialClasses = await firstButton.getAttribute('class');

            // 클릭
            await firstButton.click();

            // 클릭 후 상태 변경 확인
            const newClasses = await firstButton.getAttribute('class');
            expect(newClasses).not.toBe(initialClasses);
        }
    });

    test('섹션 추가 버튼이 작동해야 함', async ({ page }) => {
        await page.goto('/ko/submit');

        // 개요 섹션 추가 버튼
        const overviewButton = page.locator('button').filter({ hasText: /개요|Overview/i }).first();

        if (await overviewButton.isVisible()) {
            // 내용 입력 필드의 초기 값
            const contentTextarea = page.locator('textarea[name="content"]');
            const initialContent = await contentTextarea.inputValue();

            // 버튼 클릭
            await overviewButton.click();

            // 내용이 추가되었는지 확인
            const newContent = await contentTextarea.inputValue();
            expect(newContent.length).toBeGreaterThan(initialContent.length);
        }
    });

    test('미리보기 버튼이 작동해야 함', async ({ page }) => {
        await page.goto('/ko/submit');

        // 내용 입력
        const contentTextarea = page.locator('textarea[name="content"]');
        await contentTextarea.fill('# Test Content\n\nThis is a test.');

        // 미리보기 버튼 클릭
        const previewButton = page.locator('button').filter({ hasText: /미리보기|Preview/i }).first();
        await previewButton.click();

        // 미리보기 모달이 표시되어야 함
        const modal = page.locator('[role="dialog"], .modal').filter({ hasText: /미리보기|Preview/i });
        await expect(modal).toBeVisible();
    });

    test('미리보기 모달을 닫을 수 있어야 함', async ({ page }) => {
        await page.goto('/ko/submit');

        // 내용 입력
        const contentTextarea = page.locator('textarea[name="content"]');
        await contentTextarea.fill('# Test');

        // 미리보기 열기
        const previewButton = page.locator('button').filter({ hasText: /미리보기|Preview/i }).first();
        await previewButton.click();

        // 닫기 버튼 클릭
        const closeButton = page.locator('button').filter({ hasText: /닫기|Close/i }).first();
        await closeButton.click();

        // 모달이 사라져야 함
        const modal = page.locator('[role="dialog"], .modal').filter({ hasText: /미리보기|Preview/i });
        await expect(modal).not.toBeVisible();
    });

    test('필수 필드 누락 시 검증 오류가 표시되어야 함', async ({ page }) => {
        await page.goto('/ko/submit');

        // 제출 버튼 클릭 (필수 필드 비어있음)
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // 검증 오류 메시지가 표시되어야 함
        const errorMessages = page.locator('text=/필수|required|오류|error/i');
        const count = await errorMessages.count();
        expect(count).toBeGreaterThan(0);
    });

    test.skip('폼 제출이 작동해야 함 (GitHub 토큰 필요)', async ({ page }) => {
        // 이 테스트는 실제 GitHub 토큰이 필요하므로 skip
        // CI 환경에서는 토큰을 환경 변수로 제공할 수 있음

        await page.goto('/ko/submit');

        // 모든 필드 입력
        await page.fill('input[name="title"]', 'E2E Test Rule');
        await page.fill('input[name="tags"]', 'test, e2e');
        await page.selectOption('select[name="difficulty"]', 'beginner');
        await page.fill('input[name="author"]', 'E2E Tester');
        await page.fill('textarea[name="content"]', '# Test Content\n\nThis is an E2E test.');

        // 카테고리 선택
        const categoryButton = page.locator('button').filter({ hasText: /TypeScript/i }).first();
        await categoryButton.click();

        // 제출
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // 성공 메시지 또는 GitHub Issue 페이지 확인
        // (실제 동작은 토큰 설정에 따라 다름)
    });
});
