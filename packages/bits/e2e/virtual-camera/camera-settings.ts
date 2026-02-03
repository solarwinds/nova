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

import {
    CAMERA_DEFAULT_SETTINGS,
    ICameraSettings,
    ICameraSettingsActions,
} from "./types";
import type { Page } from "@playwright/test";

export class CameraSettings {
    public currentSettings: ICameraSettings;

    constructor() {
        this.currentSettings = { ...CAMERA_DEFAULT_SETTINGS };
    }

    public actions: ICameraSettingsActions = {
        fullframe: this.fullframe.bind(this),
        crop: this.crop.bind(this),
        responsive: this.responsive.bind(this),
        defaultResponsive: this.defaultResponsive.bind(this),
    };

    private async fullframe(): Promise<void> {
        this.currentSettings.fullframe = true;
    }

    private async crop(): Promise<void> {
        this.currentSettings.fullframe = false;
    }

    private async responsive(
        values: Array<number>,
        callback?: (page: Page) => void
    ): Promise<void> {
        this.currentSettings.responsiveWidths = [...values];
        this.currentSettings.responsivityCallback = callback;
    }

    private async defaultResponsive(): Promise<void> {
        this.currentSettings.responsiveWidths =
            CAMERA_DEFAULT_SETTINGS.responsiveWidths;
    }
}
