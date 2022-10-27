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

import { $, ProtractorBrowser } from "protractor";

import {
    ICameraSettings,
    ILens,
    PercyLensSnapshotOptions,
    PERCY_DEFAULT_CONFIG,
} from "./types";

export class PercyLens implements ILens {
    private percySnapshot = require("@percy/protractor");
    private percyConfig: PercyLensSnapshotOptions;

    constructor(
        private browser: ProtractorBrowser,
        private settings: ICameraSettings
    ) {
        this.percyConfig = { ...PERCY_DEFAULT_CONFIG };
    }

    public async takeSnapshot(label: string): Promise<void> {
        this.checkSettings();

        await this.percySnapshot(
            `${this.settings.currentTestName} - ${label}`,
            { ...this.percyConfig }
        );
    }

    public async takeFullScreenSnapshot(label: string): Promise<void> {
        await this.takeSnapshot(label);
    }

    public async cameraON(): Promise<void> {
        if (this.browser.params["snapshotsUpload"] === "manual") {
            await this.setManualFullpage();
        }

        await this.setCustomCSS();
    }

    public async cameraOFF(): Promise<void> {}

    public toolConfig(): void {
        console.warn("No config is available for Percy");
    }

    private checkSettings() {
        this.percyConfig.widths = [...this.settings.responsiveWidths];
    }

    private async setManualFullpage(): Promise<void> {
        const win: number = (await this.browser.manage().window().getSize())
            .height;
        const body: number = (await $("body").getSize()).height;
        await this.browser
            .manage()
            .window()
            .setSize(1920, body > win ? body : win);
    }

    private async setCustomCSS() {
        await this.browser.executeScript(`
            const styles = document.createElement('style');
            styles.innerText = "input, textarea { caret-color: transparent;} * {cursor: none !important;}";
            document.head.appendChild(styles);
        `);
    }
}
