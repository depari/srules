import { test, expect } from '@playwright/test';

test.describe('Theme Hydration', () => {
    test('should not have hydration mismatch errors when theme is light', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            const text = msg.text();
            if (msg.type() === 'error' && (text.includes('hydration') || text.includes('Hydration'))) {
                consoleErrors.push(text);
                console.error('Detected hydration error:', text);
            }
        });

        // 1. 초기 접속 및 localStorage 설정
        await page.goto('/ko');
        await page.evaluate(() => {
            localStorage.setItem('srules-theme', 'light');
        });

        // 2. 페이지 새로고침 (hydration 유발)
        // 새로고침 하면 서버에서 html class="dark"로 오지만, 
        // blocking script가 class="light"로 바꾸고, 
        // React hydration 시 mismatch가 발생해야 함
        await page.reload();
        
        // 충분한 hydration 대기
        await page.waitForTimeout(2000);

        // 3. hydration 에러 확인
        // 에러가 있으면 테스트 실패
        expect(consoleErrors, 'Hydration mismatch errors were detected in the console').toHaveLength(0);
        
        // 4. 상태 확인
        const htmlClass = await page.evaluate(() => document.documentElement.className);
        expect(htmlClass).toBe('light');
    });

    test('should maintain dark theme by default without hydration errors', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            const text = msg.text();
            if (msg.type() === 'error' && (text.includes('hydration') || text.includes('Hydration'))) {
                consoleErrors.push(text);
            }
        });

        await page.goto('/ko');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.waitForTimeout(2000);

        expect(consoleErrors).toHaveLength(0);
        const htmlClass = await page.evaluate(() => document.documentElement.className);
        expect(htmlClass).toBe('dark');
    });
});
