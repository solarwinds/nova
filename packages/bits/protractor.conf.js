/* eslint-env node, es6 */
const { SpecReporter } = require("jasmine-spec-reporter");
const { TeamCityReporter } = require("jasmine-reporters");

exports.config = {
    SELENIUM_PROMISE_MANAGER: false,
    seleniumAddress: process.env.SELENIUM_ADDRESS,
    // Increasing the all scripts timeout to be much above the default jasmine timeout to make visual tests more robust
    allScriptsTimeout: 100000,
    suites: {
        e2e: "./spec/**/freetype-query-builder.e2e.ts",
        visual: "./spec/**/freetype-query-builder.visual.ts",
        a11y: "./spec/**/*.a11y.ts",
    },
    capabilities: {
        shardTestFiles: process.env.CI ? true : false,
        maxInstances: process.env.CI ? 5 : 1,
        browserName: "chrome",
        chromeOptions: {
            w3c: false, // enable legacy API to prevent this error: https://github.com/angular/protractor/issues/5285
            args: [
                "--headless",
                "--no-sandbox",
                "--disable-extensions",
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--window-size=1920,1080",
            ],
        },
    },
    grep: process.env["npm_config_grep"],
    random: false,
    baseUrl: process.env.E2E_BASE_URL || "http://localhost:4200/",
    directConnect: !process.env.SELENIUM_ADDRESS,
    framework: "jasmine",
    params: {
        visual: "percy",
        snapshotsUpload: "manual",
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 100000,
        print: function () {},
    },
    onPrepare() {
        require("ts-node").register({
            project: require("path").join(__dirname, "tsconfig.e2e.json"),
        });

        jasmine
            .getEnv()
            .addReporter(
                new SpecReporter({ spec: { displayStacktrace: "pretty" } })
            );

        if (process.env.TEAMCITY_VERSION) {
            jasmine.getEnv().addReporter(new TeamCityReporter());
        }
    },
    onComplete() {
        // console.debug("Complete fired");
    },
    onCleanUp(exitCode) {
        // console.debug("Clean up fired, code = " + exitCode);
    },
    logLevel: process.env.CI ? "DEBUG" : "WARN",
};
