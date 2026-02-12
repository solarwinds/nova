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

import { Page } from "@playwright/test";

import { EyesLens } from "./eyes-lens";
import {
    ICameraSettings,
    ILens,
    PercyLensSnapshotOptions,
    PERCY_DEFAULT_CONFIG,
} from "./types";

export class PercyLens extends EyesLens implements ILens {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    private percySnapshot = require("@percy/playwright").percySnapshot;
    private percyConfig: PercyLensSnapshotOptions;

    constructor(protected page: Page, protected settings: ICameraSettings) {
        super(page, settings);
        this.percyConfig = { ...PERCY_DEFAULT_CONFIG };
    }

    public async takeSnapshot(label: string): Promise<void> {
        await super.takeSnapshot(label);
        this.checkSettings();

        await this.percySnapshot(
            this.page,
            `${this.settings.currentTestName} - ${label}`,
            { ...this.percyConfig }
        );
    }

    public async takeFullScreenSnapshot(label: string): Promise<void> {
        await this.takeSnapshot(label);
    }

    public async cameraON(): Promise<void> {
        await this.setCustomCSS();
    }

    public async cameraOFF(): Promise<void> {}

    public toolConfig(): void {
        console.warn("No config is available for Percy");
    }

    private checkSettings() {
        this.percyConfig.widths = [...this.settings.responsiveWidths];
        if (typeof this.settings.responsivityCallback === "function") {
            this.settings.responsivityCallback(this.page);
        }
    }

    private async setCustomCSS() {
        await this.page.addStyleTag({
            content:
                "input, textarea { caret-color: transparent;} * {cursor: none !important;}",
        });
    }
}
