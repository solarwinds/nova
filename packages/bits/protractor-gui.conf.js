/* eslint-env es2020 */
const { config } = require("./protractor.conf.js");

exports.config = {
    ...config,
    capabilities: {
        browserName: "chrome",
        chromeOptions: {
            w3c: false,
            args: [
                "--no-sandbox",
                "--disable-extensions",
                "--disable-gpu",
                "--window-size=1920,1080",
            ],
        },
    },
};
