const { SpecReporter } = require('jasmine-spec-reporter');
const { TeamCityReporter } = require("jasmine-reporters");

exports.config = {
    SELENIUM_PROMISE_MANAGER: false,
    seleniumAddress: process.env.SELENIUM_ADDRESS,
    allScriptsTimeout: 11000,
    suites: {
        e2e: './spec/**/*.e2e.ts',
        visual: './spec/**/*.visual.ts'
    },
    capabilities: {
        shardTestFiles: process.env.CI ? true : false,
        maxInstances: process.env.CI ? 4 : 1,
        'browserName': 'chrome',
        'chromeOptions': {
            'w3c': false, // enable legacy API to prevent this error: https://github.com/angular/protractor/issues/5285
            'args': [
                "--headless",
                "--no-sandbox",
                "--disable-extensions",
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--window-size=1920,1080"
            ]
        }
    },
    baseUrl: process.env.E2E_BASE_URL || "http://localhost:4200/",
    directConnect: !process.env.SELENIUM_ADDRESS,
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        print: function () { }
    },
    onPrepare() {
        require('ts-node').register({
            project: require('path').join(__dirname, './tsconfig.e2e.json')
        });
        jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));

        if (process.env.TEAMCITY_VERSION) {
            jasmine.getEnv().addReporter(new TeamCityReporter())
        }
    },
    onComplete() {
        //console.log("Complete fired");
    },
    onCleanUp(exitCode) {
        //console.log("Clean up fired, code = " + exitCode);
    },
    logLevel: process.env.CI ? "INFO" : "WARN"
};
