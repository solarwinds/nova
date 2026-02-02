import { defineConfig, devices } from "@playwright/test";

const baseUse = {
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 720 },
};

export default defineConfig({
    // Default settings for all projects

    use: {
        baseURL: process.env["PLAYWRIGHT_TEST_BASE_URL"] ?? "http://localhost:4200", // Adjust if using Storybook or another dev server
        headless: true,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },
    workers: process.env["CI"] ? 1 : undefined,
    fullyParallel: true,
    forbidOnly: !!process.env["CI"],
    retries: process.env["CI"] ? 2 : 0,
    // Define separate projects (test suites)
    projects: [
        // End-to-End Tests
        {
            name: "e2e",
            testMatch: /.*\.e2e\.spec\.ts/,
            use: baseUse,
        },

        // Accessibility Tests
        {
            name: "a11y",
            testMatch: /.*\.a11y\.spec\.ts/,
            use: baseUse,
        },

        // Visual Regression Tests
        {
            name: "visual",
            testMatch: /.*\.visual\.spec\.ts/,
            use: { ...baseUse, screenshot: "on" },
        },
    ],

    // Global test directories (or you can scope to `packages/**/e2e` if needed)
    testDir: "./e2e",

    // Optional output for artifacts (traces, screenshots, etc.)
    outputDir: "test-results/",

    reporter: process.env.CI ? "blob" : "html",
    webServer: {
        command: "yarn run serve-examples:prod",
        url: "http://localhost:4200",
        reuseExistingServer: !process.env["CI"],
    },
});
