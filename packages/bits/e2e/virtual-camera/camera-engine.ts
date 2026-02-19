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

import { Page } from "@playwright/test";

import { PercyLens } from "./percy-lens";
import { EyesLens } from "./eyes-lens";
import { ICameraSettings, ILens, LENSES, LensType } from "./types";

export class CameraEngine {
    public currentLensInstance: ILens;
    private snapshotsFolderName: string = "_snapshots";

    constructor(
        private page: Page,
        private settings: ICameraSettings
    ) {
        this.useLens();
    }

    private useLens() {
        if (!this.page) {
            throw new Error(
                "Playwright 'page' instance is required! Please pass one as an argument to the 'loadFilm()' method"
            );
        }

        this.settings.globalLens = process.env.PERCY_TOKEN
            ? LensType.Percy
            : LensType.Eyes;

        if (
            this.settings.globalLens &&
            LENSES.includes(this.settings.globalLens)
        ) {
            switch (this.settings.globalLens) {
                case LensType.Percy:
                    this.currentLensInstance = new PercyLens(
                        this.page,
                        this.settings
                    );
                    break;
                case LensType.Eyes:
                    this.currentLensInstance = new EyesLens(
                        this.page,
                        this.settings
                    );
                    break;
            }
        } else {
            throw new Error(
                "No suitable lenses found! Ensure Percy is configured (PERCY env var) or set SNAPSHOTS_UPLOAD=manual to save PNGs"
            );
        }

        return this;
    }

    public async takePhoto(label: string): Promise<void> {

        if (!this.settings.fullframe) {
            return await this.currentLensInstance.takeSnapshot(label);
        }

        if (this.settings.fullframe) {
            return await this.currentLensInstance.takeFullScreenSnapshot(label);
        }
    }

    public getToolConfig(): ReturnType<ILens["toolConfig"]> {
        return this.currentLensInstance ? this.currentLensInstance.toolConfig() : undefined as any;
    }

    private cleanFileName(name: string) {
        return name.replace(/[\\\/\s]/g, "_");
    }
}
