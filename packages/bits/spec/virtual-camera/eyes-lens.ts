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

import { ProtractorBrowser } from "protractor";

import { getCurrentBranchName } from "../helpers";
import { ICameraSettings, ILens } from "./types";
export class EyesLens implements ILens {
    public eyes: any;

    constructor(
        private browser: ProtractorBrowser,
        private cameraSettings: ICameraSettings
    ) {}

    public async takeSnapshot(label: string): Promise<void> {
        await this.eyes.setForceFullPageScreenshot(false);
        await this.snapshotEachWidth(label);
    }

    public async takeFullScreenSnapshot(label: string): Promise<void> {
        await this.eyes.setForceFullPageScreenshot(true);
        await this.snapshotEachWidth(label);
    }

    public async cameraON(): Promise<void> {
        this.eyes = await this.configure();
        await this.eyes.open(
            this.browser,
            this.cameraSettings.currentSuiteName,
            this.cameraSettings.currentTestName
        );
    }

    public async cameraOFF(): Promise<void> {
        await this.eyes.close();
        await this.eyes.abortIfNotClosed();
    }

    public toolConfig(): any {
        return this.eyes;
    }

    private async configure() {
        const { Eyes } = require("@applitools/eyes-protractor");

        if (!this.eyes) {
            this.eyes = new Eyes();
            this.eyes.setApiKey(<string>process.env.EYES_API_KEY);

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
                ? this.eyes.setBatch(batchName, batchID)
                : this.eyes.setBatch(batchName);

            this.eyes.setBranchName(branchName);
            if (branchName !== "main") {
                this.eyes.setParentBranchName("main");
            }
            this.eyes.setForceFullPageScreenshot(true);
            this.eyes.setIgnoreCaret(true);
        }

        return this.eyes;
    }

    private async snapshotEachWidth(label: string): Promise<void> {
        for (const width of this.cameraSettings.responsiveWidths) {
            await this.browser.manage().window().setSize(width, 1080);

            if (this.cameraSettings.responsivityCallback) {
                await this.cameraSettings.responsivityCallback();
            }

            await this.eyes.checkWindow(label);
        }
    }
}
