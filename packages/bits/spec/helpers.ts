// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import * as fs from "fs";
import * as path from "path";

import { browser, by, ProtractorBrowser } from "protractor";
import { WebElementPromise } from "selenium-webdriver";

export enum Animations {
    ALL,
    TRANSITIONS,
    TRANSFORMS,
    ANIMATIONS,
    TRANSFORMS_AND_ANIMATIONS,
    TRANSITIONS_AND_ANIMATIONS,
    TRANSITIONS_AND_TRANSFORMS,
}

// Node typings have conflicts with webpack-env
declare let process: any;

let eyes: any;

export function getCurrentBranchName(
    potentialGitRoot: string = process.cwd()
): string | undefined {
    const gitHeadPath = `${potentialGitRoot}/.git/HEAD`;

    if (!fs.existsSync(potentialGitRoot)) {
        return undefined;
    }

    if (fs.existsSync(gitHeadPath)) {
        // Taking last two fragments of branch name, usually it is formatted like branch_type/branch_name
        return fs
            .readFileSync(gitHeadPath, "utf-8")
            .trim()
            .split("/")
            .slice(2)
            .join("/");
    }
    // Recursively looking for git folder
    return getCurrentBranchName(path.resolve(potentialGitRoot, ".."));
}

export async function assertA11y(
    browser: ProtractorBrowser,
    atomSelector: string,
    disabledRules?: string[]
): Promise<void> {
    const AxeBuilder = require("@axe-core/webdriverjs");
    const accessibilityScanResults = await new AxeBuilder(browser.driver)
        .include(`.${atomSelector}`)
        .disableRules(disabledRules || [])
        .analyze();

    await expect(accessibilityScanResults.violations).toEqual([]);
}

export class Helpers {
    static async prepareBrowser(pageName?: string): Promise<void> {
        let url = "";
        if (pageName) {
            url += "#/" + pageName;
        }
        await browser.angularAppRoot("app");
        await browser.get(url);
        browser.clearMockModules();
    }

    public static getElementByXpath(elementXpath: string): WebElementPromise {
        return browser.driver.findElement(by.xpath(elementXpath));
    }

    public static getElementByCSS(elementCSS: string): WebElementPromise {
        return browser.driver.findElement(by.css(elementCSS));
    }

    public static async setCustomWidth(size: string, id: string): Promise<{}> {
        return browser.executeScript(
            `document.getElementById("${id}").style.width = "${size}"`
        );
    }

    public static async browserZoom(percent: number): Promise<unknown> {
        return browser.executeScript(`document.body.style.zoom='${percent}%'`);
    }

    public static async pressKey(
        key: string,
        times: number = 1
    ): Promise<void> {
        while (times > 0) {
            await browser.actions().sendKeys(key).perform();
            times--;
        }
    }

    public static async clickOnEmptySpace(
        x: number = 0,
        y: number = 0
    ): Promise<void> {
        return browser.executeScript(
            "document.elementFromPoint(arguments[0],arguments[1]).click()",
            x,
            y
        );
    }

    // for non-applitools run just rename this method to `prepareEyes`
    static prepareFakeEyes(): unknown {
        const { Eyes } = require("@applitools/eyes-protractor");

        if (!eyes) {
            eyes = new Eyes();
            eyes.open = async () => true;
            eyes.close = async () => true;
            eyes.abortIfNotClosed = async () => true;
            eyes.setStitchMode = () => true;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            eyes.checkWindow = async (s: string) => {
                console.log(s);
                await browser.sleep(3000);
            };
            eyes.checkRegion = console.log;
        }

        return eyes;
    }

    static async prepareEyes(): Promise<unknown> {
        const { Eyes } = require("@applitools/eyes-protractor");

        if (!eyes) {
            eyes = new Eyes();
            eyes.setApiKey(<string>process.env.EYES_API_KEY);

            let branchName =
                <string>process.env.CIRCLE_BRANCH ||
                getCurrentBranchName() ||
                "Unknown";
            const userName: string = <string>process.env.CIRCLE_USERNAME
                ? ` - [${process.env.CIRCLE_USERNAME}]`
                : "";
            const batchName =
                (<string>process.env.CIRCLE_PROJECT_REPONAME)?.toUpperCase() +
                " - " +
                <string>process.env.CIRCLE_JOB +
                " - " +
                branchName +
                userName;
            const batchID =
                <string>process.env.CIRCLE_JOB +
                "_" +
                <string>process.env.CIRCLE_SHA1;

            branchName = branchName.substring(branchName.lastIndexOf("/") + 1);
            batchID
                ? eyes.setBatch(batchName, batchID)
                : eyes.setBatch(batchName);

            eyes.setBranchName(branchName);
            if (branchName !== "main") {
                eyes.setParentBranchName("main");
            }
            eyes.setForceFullPageScreenshot(true);
            eyes.setIgnoreCaret(true);
        }
        return eyes;
    }

    static async switchDarkTheme(mode: "on" | "off"): Promise<void> {
        const htmlClassList: string = `document.getElementsByTagName("html")[0].classList`;
        const script =
            mode === "on"
                ? `${htmlClassList}.add("dark-nova-theme")`
                : `${htmlClassList}.remove("dark-nova-theme")`;
        await browser.executeScript(script);
    }

    /**
     * TODO: make this method configurable, so that we would be able to partly disable
     * or enable the animations:
     *
     * https://jira.solarwinds.com/browse/NUI-2034
     */
    static async disableCSSAnimations(type: Animations): Promise<{}> {
        let disableTransitions =
            "-o-transition-property: none !important;" +
            "-moz-transition-property: none !important;" +
            "-ms-transition-property: none !important;" +
            "-webkit-transition-property: none !important;" +
            "transition-property: none !important;";

        let disableTransforms =
            "-o-transform: none !important;" +
            "-moz-transform: none !important;" +
            "-ms-transform: none !important;" +
            "-webkit-transform: none !important;" +
            "transform: none !important;";

        let disableAnimations =
            "-webkit-animation: none !important;" +
            "-moz-animation: none !important;" +
            "-o-animation: none !important;" +
            "-ms-animation: none !important;" +
            "animation: none !important;";

        switch (type) {
            case Animations.ALL:
                break;
            case Animations.TRANSITIONS:
                disableTransforms = "";
                disableAnimations = "";
                break;
            case Animations.TRANSFORMS:
                disableAnimations = "";
                disableTransitions = "";
                break;
            case Animations.ANIMATIONS:
                disableTransforms = "";
                disableTransitions = "";
                break;
            case Animations.TRANSFORMS_AND_ANIMATIONS:
                disableTransitions = "";
                break;
            case Animations.TRANSITIONS_AND_ANIMATIONS:
                disableTransforms = "";
                break;
            case Animations.TRANSITIONS_AND_TRANSFORMS:
                disableAnimations = "";
                break;
        }

        const css =
            "*, *:before, *:after {" +
            disableTransitions +
            disableTransforms +
            disableAnimations +
            "}";

        return browser.executeScript(`
            var head = document.head || document.getElementsByTagName("head")[0];
                            var style = document.createElement("style");
                            style.type = "text/css";
                            style.appendChild(document.createTextNode("${css}"));
            head.appendChild(style);
        `);
    }

    static async saveScreenShot(filename: string): Promise<void> {
        return browser.takeScreenshot().then((data) => {
            const stream = fs.createWriteStream(filename);
            stream.write(Buffer.from(data, "base64"));
            stream.end();
        });
    }

    static async setLocation(url: string): Promise<void> {
        return browser.executeScript(
            (pUrl: string) => (window.location.href = `/#/${pUrl}`),
            url
        );
    }
}
