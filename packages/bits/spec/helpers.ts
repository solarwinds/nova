import * as fs from "fs";
import * as path from "path";
import { browser, by } from "protractor";
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
declare var process: any;

let eyes: any;

function getCurrentBranchName(potentialGitRoot = process.cwd()): string | undefined {
    const gitHeadPath = `${potentialGitRoot}/.git/HEAD`;

    if (!fs.existsSync(potentialGitRoot)) {
        return undefined;
    }

    return fs.existsSync(gitHeadPath)
        // Taking last two fragments of branch name, usually it is formatted like branch_type/branch_name
        ? fs.readFileSync(gitHeadPath, "utf-8").trim().split("/").slice(2).join("/")
        // Recursively looking for git folder
        : getCurrentBranchName(path.resolve(potentialGitRoot, ".."));
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
        return browser.executeScript(`document.getElementById("${id}").style.width = "${size}"`);
    }

    public static async browserZoom(percent: number) {
        return browser.executeScript(`document.body.style.zoom='${percent}%'`);
    }

    public static async pressKey(key: string, times: number = 1) {
        while (times > 0) {
            await browser.actions().sendKeys(key).perform();
            times--;
        }
    }

    public static async clickOnEmptySpace(x: number = 0, y: number = 0): Promise<void> {
        return browser.executeScript("document.elementFromPoint(arguments[0],arguments[1]).click()", x, y);
    }

    // for non-applitools run just rename this method to `prepareEyes`
    static prepareFakeEyes() {
        const { Eyes } = require("@applitools/eyes-protractor");

        if (!eyes) {
            eyes = new Eyes();
            eyes.open = async () => true;
            eyes.close = async () => true;
            eyes.abortIfNotClosed = async () => true;
            eyes.setStitchMode = () => true;
            eyes.checkWindow = async (s: string) => {  console.log(s); await browser.sleep(2000); },
            eyes.checkRegion = console.log;
        }

        return eyes;
    }

    static async prepareEyes() {
        const { Eyes } = require("@applitools/eyes-protractor");

        if (!eyes) {
            eyes = new Eyes();
            eyes.setApiKey(<string>process.env.EYES_API_KEY);
            
            const userName: string = process.env.CIRCLE_USERNAME ? ` - [${process.env.CIRCLE_USERNAME}]` : "";
            const circleApiToken = process.env.CIRCLE_API_TOKEN;
            const circleWorkflowID = process.env.CIRCLE_WORKFLOW_ID;
            // This API link returns the currect workflow details
            const circleCurrentWorkflowUrl = `https://circleci.com/api/v2/workflow/${circleWorkflowID}?circle-token=${circleApiToken}`;
            // CircleCI does not expose the current workflow name as an environment variable, so
            // we are fetching this url to get the name of the current workflow to later re-use it in the batch name below
            const currentWorkflowName =
                    (await
                        (await fetch(circleCurrentWorkflowUrl,
                                { headers:
                                    {
                                        "Content-Type": "application/json",
                                    },
                                }
                            )
                        ).json())?.name;

            let branchName = <string>process.env.CIRCLE_BRANCH || getCurrentBranchName() || "Unknown";
            const batchName = (<string>process.env.CIRCLE_PROJECT_REPONAME)?.charAt(0)?.toUpperCase()
                                + " - "
                                + currentWorkflowName
                                + " - "
                                + branchName
                                + userName;
            const batchID = <string>process.env.APPLITOOLS_BATCH_ID;

            branchName = branchName.substring(branchName.lastIndexOf("/") + 1);
            if (batchID) {
                eyes.setBatch(batchName, batchID);
            } else {
                eyes.setBatch(batchName);
            }

            eyes.setBranchName(branchName);
            if (branchName !== "develop") {
                eyes.setParentBranchName("develop");
            }
            eyes.setForceFullPageScreenshot(true);
            eyes.setIgnoreCaret(true);
        }
        return eyes;
    }

    /**
     * TODO: make this methos configurable, so that we would be able to partly disable
     * or enable the animations:
     *
     * https://jira.solarwinds.com/browse/NUI-2034
     */
    static async disableCSSAnimations(type: Animations): Promise<{}> {

        let disableTransitions = "-o-transition-property: none !important;" +
            "-moz-transition-property: none !important;" +
            "-ms-transition-property: none !important;" +
            "-webkit-transition-property: none !important;" +
            "transition-property: none !important;";

        let disableTransforms = "-o-transform: none !important;" +
            "-moz-transform: none !important;" +
            "-ms-transform: none !important;" +
            "-webkit-transform: none !important;" +
            "transform: none !important;";

        let disableAnimations = "-webkit-animation: none !important;" +
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

        const css = "*, *:before, *:after {" + disableTransitions + disableTransforms + disableAnimations + "}";

        return browser.executeScript(`var head = document.head || document.getElementsByTagName("head")[0];
                            var style = document.createElement("style");
                            style.type = "text/css";
                            style.appendChild(document.createTextNode("${css}"));
                            head.appendChild(style); `);
    }

    static async saveScreenShot(filename: string): Promise<void> {
        return browser.takeScreenshot().then((data) => {
            const stream = fs.createWriteStream(filename);
            stream.write(Buffer.from(data, "base64"));
            stream.end();
        });
    }

}
