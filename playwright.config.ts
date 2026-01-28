import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e',

    /* 병렬 테스트 실행 */
    fullyParallel: true,

    /* CI에서 재시도 설정 */
    retries: process.env.CI ? 2 : 0,

    /* CI에서는 병렬 실행 제한 */
    workers: process.env.CI ? 1 : undefined,

    /* 리포터 설정 */
    reporter: [
        ['html'],
        ['list'],
    ],

    /* 공통 설정 */
    use: {
        /* 베이스 URL */
        baseURL: 'http://localhost:3000',

        /* 실패 시 스크린샷 캡처 */
        screenshot: 'only-on-failure',

        /* 실패 시 비디오 녹화 */
        video: 'retain-on-failure',

        /* 추적 설정 */
        trace: 'on-first-retry',
    },

    /* 테스트 전 개발 서버 실행 */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },

    /* 브라우저 설정 */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        /* 모바일 뷰포트 테스트 */
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],
});
