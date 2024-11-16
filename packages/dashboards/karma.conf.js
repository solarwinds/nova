// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: "",
        frameworks: ["jasmine", "@angular-devkit/build-angular"],
        plugins: [
            require("@angular-devkit/build-angular/plugins/karma"),
            require("karma-chrome-launcher"),
            require("karma-coverage"),
            require("karma-junit-reporter"),
            require("karma-jasmine-html-reporter"),
            require("karma-jasmine"),
            require("karma-spec-reporter"),
        ],
        client: {
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
            jasmine: {
                random: false,
            },
        },
        junitReporter: {
            outputDir: 'test-results', // Directory for test results
            outputFile: 'karma-results.xml', // Optional: file name for JUnit XML results
            useBrowserName: false,
        },
        coverageReporter: {
            dir: require("path").join(__dirname, "coverage"),
            reports: [
                { type: "html", subdir: "report-html" },
                { type: "lcovonly", subdir: "report-lcovonly" },
            ],
        },
        angularCli: {
            environment: "dev",
        },
        reporters: ["progress", "coverage", "kjhtml", "junit"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ["ChromeNaked"],
        browserDisconnectTolerance: 2,
        browserNoActivityTimeout: 30000,
        customLaunchers: {
            ChromeNaked: {
                base: "ChromeHeadless",
                flags: [
                    "--no-sandbox",
                    "--headless",
                    "--disable-translate",
                    "--disable-extensions",
                ],
            },
        },
        files: [
            {
                pattern: "dist/fesm2022/nova-ui-dashboards.mjs",
                watched: false,
                included: false,
                served: true,
            },
        ],
        singleRun: false,
    });
};
