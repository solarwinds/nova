import { defineConfig, devices } from "@playwright/test";

const baseUse = {
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 720 },
};

export default defineConfig({
    use: {
        baseURL:
            process.env["PLAYWRIGHT_TEST_BASE_URL"] ?? "http://localhost:4200",
        headless: true,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },
    timeout: 10_000,
    expect: {
        timeout: 5_000,
    },
    workers: process.env["CI"] ? 1 : undefined,
    fullyParallel: true,
    forbidOnly: !!process.env["CI"],
    retries: process.env["CI"] ? 2 : 0,
    projects: [
        {
            name: "e2e",
            testMatch: /.*\.e2e\.spec\.ts/,
            use: baseUse,
        },
        {
            name: "a11y",
            testMatch: /.*\.a11y\.spec\.ts/,
            use: baseUse,
        },
        {
            name: "visual",
            testMatch: /.*\.visual\.spec\.ts/,
            use: { ...baseUse, screenshot: "on" },
        },
    ],
    testDir: "./e2e",
    outputDir: "test-results/",
    reporter: process.env.CI
        ? [["blob"], ["junit", { outputFile: "test-results/results.xml" }]]
        : [["html"]],
    webServer: {
        command: "yarn run serve-examples:prod",
        url: "http://localhost:4200",
        reuseExistingServer: !process.env["CI"],
    },
});
