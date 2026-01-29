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

import {expect, Locator} from "@playwright/test";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";

export class ProgressAtom extends Atom {
    public static CSS_CLASS = "nui-progress";

    private get root(): Locator {
        return this.getLocator();
    }

    public getCancelButton(): ButtonAtom {
        return Atom.findIn<ButtonAtom>(ButtonAtom, this.root.locator(".nui-progress__cancel"), true);
    }

    public async canCancel(): Promise<boolean> {
        const cancelBtn = this.root.locator(".nui-progress__cancel");
        return await cancelBtn.count() > 0 && (await cancelBtn.isVisible());
    }

    public async cancelProgress(): Promise<void> {
        await this.getCancelButton().click();
    }

    public async getWidth(): Promise<number> {
        const style = await this.root.evaluate(
            (el) => window.getComputedStyle(el).width
        );
        return Number(style.replace("px", ""));
    }

    public async getLabel(): Promise<string> {
        return await this.root.locator(".nui-progress__message").innerText();
    }

    public async getPercent(): Promise<string> {
        return await this.root.locator(".nui-progress__number").innerText();
    }

    public async getOptionalDescription(): Promise<string> {
        return await this.root.locator(".nui-progress__hint").innerText();
    }

    public async isProgressBarDisplayed(): Promise<boolean> {
        const bar = this.root.locator(".nui-progress__bar");
        return await bar.isVisible();
    }

    public async waitForDisplayed(timeout = 5000): Promise<void> {
        await expect(this.root).toBeVisible({ timeout });
    }

    public async isIndeterminate(): Promise<boolean> {
        const bar = this.root.locator(".nui-progress__bar");
        const classList = await bar.getAttribute("class");
        return classList?.includes("nui-progress--indeterminate") ?? false;
    }
}
