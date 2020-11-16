// Protractor configuration file for running on TeamCity, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
const jasmineReporters = require('jasmine-reporters');

exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        './e2e/**/*.e2e-spec.ts'
    ],
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': [
                'no-sandbox',
                '--disable-web-security'
            ]
        }
    },
    SELENIUM_PROMISE_MANAGER: false,
    directConnect: false,
    seleniumAddress: 'http://selenium-chrome-standalone:4444/wd/hub',
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        print: function () {
        }
    },
    onPrepare() {
        require('ts-node').register({
            project: 'e2e/tsconfig.e2e.json'
        });

        browser.baseUrl = 'http://web:80/';
        if (process.env.TEAMCITY_VERSION) {
            jasmine.getEnv().addReporter(new jasmineReporters.TeamCityReporter());
        } else {
            jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
        }
    }
};
