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

import { Locator } from "playwright-core";

import { ToastAtom } from "./toast.atom";
import { Helpers, expect } from "../../setup";

// interfaces duplicated here because if we import them from lib, dist-copy for atoms will work improperly
export interface IToastDeclaration {
    title?: string;
    message?: string;
    options?: IToastConfig;
    itemsToHighlight?: any[];
}

export const enum ToastPositionClass {
    TOP_CENTER = "nui-toast--top-center",
    TOP_LEFT = "nui-toast--top-left",
    TOP_RIGHT = "nui-toast--top-right",
    TOP_FULL_WIDTH = "nui-toast--top-full-width",
    BOTTOM_CENTER = "nui-toast--bottom-center",
    BOTTOM_FULL_WIDTH = "nui-toast--bottom-full-width",
    BOTTOM_RIGHT = "nui-toast--bottom-right",
    BOTTOM_LEFT = "nui-toast--bottom-left",
}

export interface IToastConfig {
    timeOut?: number;
    closeButton?: boolean;
    extendedTimeOut?: number;
    progressBar?: boolean;
    progressAnimation?: "increasing" | "decreasing";
    enableHtml?: boolean;
    toastClass?: string;
    positionClass?: ToastPositionClass | string;
    clickToDismiss?: boolean;
    stickyError?: boolean;
    maxOpened?: number;
    autoDismiss?: boolean;
    newestOnTop?: boolean;
    preventDuplicates?: boolean;
}

export class ToastTestPage {
    private readonly waitTimeout = 1000;

    private body: Locator = Helpers.page.locator("body");
    private root: Locator = Helpers.page.locator("#nui-toast-test");

    private txtCount = this.root.locator("#txtCount");
    private radioError = this.root.locator("#radioError");
    private radioInfo = this.root.locator("#radioInfo");
    private radioSuccess = this.root.locator("#radioSuccess");
    private radioWarning = this.root.locator("#radioWarning");

    private txtMessage = this.root.locator("#txtMessage");
    private txtTitle = this.root.locator("#txtTitle");

    private txtTimeOut = this.root.locator("#txtTimeOut");
    private txtExtendedTimeOut = this.root.locator("#txtExtendedTimeOut");
    private chbEnableHtml = this.root.locator("#chbEnableHtml");
    private chbClickToDismiss = this.root.locator("#chbClickToDismiss");

    private radioTopCenter = this.root.locator("#radioTopCenter");
    private radioTopLeft = this.root.locator("#radioTopLeft");
    private radioTopRight = this.root.locator("#radioTopRight");
    private radioTopFullWidth = this.root.locator("#radioTopFullWidth");
    private radioBottomCenter = this.root.locator("#radioBottomCenter");
    private radioBottomLeft = this.root.locator("#radioBottomLeft");
    private radioBottomRight = this.root.locator("#radioBottomRight");
    private radioBottomFullWidth = this.root.locator("#radioBottomFullWidth");
    private radioCustomClass = this.root.locator("#radioCustomClass");
    private chbStickyError = this.root.locator("#chbStickyError");

    private btnFire = this.root.locator("#btnFire");
    private btnReset = this.root.locator("#btnReset");

    private radioTypes: Record<string, Locator> = {
        error: this.radioError,
        info: this.radioInfo,
        success: this.radioSuccess,
        warning: this.radioWarning,
    };

    private positionElements: Locator[] = [
        this.radioTopCenter,
        this.radioTopLeft,
        this.radioTopRight,
        this.radioTopFullWidth,
        this.chbStickyError,
        this.radioBottomCenter,
        this.radioBottomLeft,
        this.radioBottomRight,
        this.radioBottomFullWidth,
        this.radioCustomClass,
    ];

    public async showToasts(
        declaration: IToastDeclaration,
        type: string = "info",
        count: number = 1
    ): Promise<void> {
        await this.updateTextBox(this.txtTitle, declaration.title || "");
        await this.updateTextBox(this.txtMessage, declaration.message || "");

        if (declaration.options) {
            await this.updateTextBox(
                this.txtTimeOut,
                `${declaration.options.timeOut}`
            );
            await this.updateTextBox(
                this.txtExtendedTimeOut,
                `${declaration.options.extendedTimeOut}`
            );
            await this.updateCheckBox(
                this.chbEnableHtml,
                declaration.options.enableHtml ?? false
            );

            await this.updateCheckBox(
                this.chbClickToDismiss,
                declaration.options.clickToDismiss ?? false
            );
        }

        for (const element of this.positionElements) {
            const el = await element.getAttribute("value");
            if (declaration.options?.positionClass === el) {
                await this.updateRadio(element);
            }
        }

        await this.updateRadio(this.radioTypes[type]);
        await this.updateTextBox(this.txtCount, count.toString());

        await this.btnFire.click();
    }

    public async reset(): Promise<void> {
        await this.btnReset.click();
    }

    public async waitForToastDisplayed(index: number = 0): Promise<ToastAtom | null> {
        const toast = this.getToast(index);
        try {
            await expect(toast.getLocator()).toBeVisible({ timeout: this.waitTimeout });
            return toast;
        } catch {
            return null;
        }
    }

    public async asertWaitForToastDisplayed(
        index: number = 0,
        message: string = ""
    ): Promise<ToastAtom> {
        const toast = await this.waitForToastDisplayed(index);
        if (!toast) {
            throw new Error(message || `toast[${index}] not displayed`);
        }
        return toast;
    }

    public getToast(index: number = 0): ToastAtom {
        const locator = this.body.locator(`.${ToastAtom.CSS_CLASS}`).nth(index);
        return new ToastAtom(locator);
    }

    public async getToastCount(): Promise<number> {
        return await this.body.locator(`.${ToastAtom.CSS_CLASS}`).count();
    }

    private async updateTextBox(input: Locator, value: string): Promise<void> {
        const currentValue = (await input.inputValue().catch(() => null)) ?? "";
        if (currentValue === value) {
            return;
        }
        await input.fill(value);
    }

    private async updateRadio(input: Locator): Promise<void> {
        await this.updateSelectable(input, true);
    }

    private async updateCheckBox(input: Locator, value: boolean): Promise<void> {
        await this.updateSelectable(input, value);
    }

    private async updateSelectable(input: Locator, value: boolean): Promise<void> {
        const currentValue = await input.isChecked().catch(async () => await input.isChecked());
        if (currentValue === value) {
            return;
        }
        await input.click();
    }
}
