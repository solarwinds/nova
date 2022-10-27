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

import { CameraEngine } from "./camera-engine";
import { CameraSettings } from "./camera-settings";
import { CameraToggle } from "./camera-toggle";
import { ICameraSettings, ICameraSettingsActions } from "./types";

export class Camera {
    private currentBrowser: ProtractorBrowser;
    private cameraSettings: CameraSettings;
    private engine: CameraEngine;

    public turn: CameraToggle;
    public info: ICameraSettings;
    public say = { cheese: this.cheese.bind(this) };
    public be: ICameraSettingsActions;
    public lens = { configure: this.configure.bind(this) };

    constructor() {}

    public loadFilm(
        browser: ProtractorBrowser,
        testName: string,
        suiteName: string = "NUI"
    ): this {
        this.currentBrowser = browser;

        this.cameraSettings = new CameraSettings();
        this.cameraSettings.currentSettings.currentTestName = testName;
        this.cameraSettings.currentSettings.currentSuiteName = suiteName;
        this.be = { ...this.cameraSettings.actions };
        this.info = this.cameraSettings.currentSettings;

        this.engine = new CameraEngine(
            this.currentBrowser,
            this.cameraSettings.currentSettings
        );
        this.turn = new CameraToggle(this.engine);

        return this;
    }

    private async cheese(label: string, timeout: number = 700) {
        await this.currentBrowser.sleep(timeout);
        await this.engine.takePhoto(label);
    }

    private configure(): any {
        return this.engine.getToolConfig();
    }
}
