// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-teamcity-reporter'),
        require('karma-coverage-istanbul-reporter'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client:{
        clearContext: false // leave Jasmine Spec Runner output visible in browser
      },
      coverageIstanbulReporter: {
        dir: require('path').join(__dirname, 'coverage'), reports: [ 'html', 'lcovonly' ],
        fixWebpackSourcePaths: true
      },
      angularCli: {
        environment: 'dev'
      },
      reporters: process.env.TEAMCITY_VERSION ? ['teamcity', 'progress', 'kjhtml'] : ['progress', 'kjhtml'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['ChromNaked'],
      browserDisconnectTolerance: 2,
      browserNoActivityTimeout: 30000,
      customLaunchers: {
        ChromNaked: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox', '--headless', '--disable-translate', '--disable-extensions']
        }
      },
      files: [
           { 'pattern': 'dist/bundles/solarwinds-nova-bits.umd.js', 'watched': false, 'included': false, 'served': true }
      ],
      singleRun: false
    });
  };
