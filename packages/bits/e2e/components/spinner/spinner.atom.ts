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

import { Locator, expect } from "@playwright/test";

import { Atom } from "../../atom";

export class SpinnerAtom extends Atom {
    public static CSS_CLASS = "nui-spinner";
    public static defaultDelay = 250;

    private get root(): Locator {
        return this.getLocator();
    }

    public async getSize(): Promise<{ width: number; height: number }> {
        const box = await this.root.boundingBox();
        return { width: box?.width ?? 0, height: box?.height ?? 0 };
    }

    public async waitForDisplayed(
        timeout: number = SpinnerAtom.defaultDelay * 1.5
    ): Promise<void> {
        await expect(this.root).toBeVisible({ timeout });
    }

    public async waitForHidden(
        timeout: number = SpinnerAtom.defaultDelay * 1.5
    ): Promise<void> {
        await expect(this.root).toBeHidden({ timeout });
    }

    public async getLabel(): Promise<string> {
        return await this.root.locator(".nui-spinner__message").innerText();
    }

    public async cancel(): Promise<void> {
        const cancelButton = this.root.locator("button");
        if (await cancelButton.isVisible()) {
            await cancelButton.click();
        }
    }
}
