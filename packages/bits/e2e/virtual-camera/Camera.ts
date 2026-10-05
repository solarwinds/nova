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

import { CameraEngine } from "./camera-engine";
import { CameraSettings } from "./camera-settings";
import { CameraToggle } from "./camera-toggle";
import { ICameraSettings, ICameraSettingsActions } from "./types";
import { test } from "../setup";

export class Camera {
    private currentPage: Page;
    private cameraSettings: CameraSettings;
    private engine: CameraEngine;

    public turn: CameraToggle;
    public info: ICameraSettings;
    public say = { cheese: this.cheese.bind(this) };
    public be: ICameraSettingsActions;
    public lens = { configure: this.configure.bind(this) };

    constructor() {}

    public loadFilm(
        page: Page,
        testName: string,
        suiteName: string = "NUI"
    ): this {
        this.currentPage = page;

        this.cameraSettings = new CameraSettings();
        this.cameraSettings.currentSettings.currentTestName = testName;
        this.cameraSettings.currentSettings.currentSuiteName = suiteName;
        this.be = { ...this.cameraSettings.actions };
        this.info = this.cameraSettings.currentSettings;

        this.engine = new CameraEngine(
            this.currentPage,
            this.cameraSettings.currentSettings
        );
        this.turn = new CameraToggle(this.engine);

        return this;
    }

    private async cheese(label: string, timeout: number = 710) {
        await test.step(`cheese ${label}`, async () => {
            await this.currentPage.waitForTimeout(timeout);
            await this.waitForStableLayout();
            await this.engine.takePhoto(label);
        });
    }

    // Wait for fonts used by visible text and layout to settle before snapshots.
    private async waitForStableLayout(): Promise<void> {
        await this.currentPage.evaluate(async () => {
            const fontRequests = new Map<string, string>();
            const textWalker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT
            );

            while (textWalker.nextNode()) {
                const textNode = textWalker.currentNode;
                const text = textNode.textContent?.trim();
                const element = textNode.parentElement;
                if (
                    !text ||
                    !element ||
                    element.getClientRects().length === 0
                ) {
                    continue;
                }

                const style = getComputedStyle(element);
                if (
                    style.display === "none" ||
                    style.visibility === "hidden" ||
                    Number(style.opacity) === 0
                ) {
                    continue;
                }

                fontRequests.set(
                    style.font,
                    `${fontRequests.get(style.font) ?? ""}${text}`
                );
            }

            await Promise.allSettled(
                Array.from(fontRequests, ([font, text]) =>
                    document.fonts.load(font, text)
                )
            );
            await document.fonts.ready;
            await new Promise<void>(resolve =>
                requestAnimationFrame(() =>
                    requestAnimationFrame(() => resolve())
                )
            );
        });
    }

    private configure(): any {
        return this.engine.getToolConfig();
    }
}
