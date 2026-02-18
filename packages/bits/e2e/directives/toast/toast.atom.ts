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

import { Atom } from "../../atom";
import { Helpers, expect } from "../../setup";
import { ButtonAtom } from "../../components/button/button.atom";

export class ToastAtom extends Atom {
    public static CSS_CLASS = "nui-toast";
    /** default timeout for toast */
    public static toastTimeout = 5000;
    /** time for 'fade out' animation */
    public static animationTimeout = 300;

    private get root(): Locator {
        return this.getLocator();
    }

    public get container(): Locator {
        return this.root.locator("xpath=..");
    }

    private get content(): Locator {
        return this.root.locator(`.${ToastAtom.CSS_CLASS}__content`).first();
    }

    public dismiss: ButtonAtom = new ButtonAtom(
        this.content.locator(`.${ToastAtom.CSS_CLASS}__dismiss-button`).first()
    );

    public getTitle = async (): Promise<string> =>
        (await this.root
            .locator(`.${ToastAtom.CSS_CLASS}__content-title`)
            .innerText()) ?? "";

    public getBody = async (): Promise<string> =>
        (await this.getBodyElement().innerText()) ?? "";

    public getBodyHtml = async (): Promise<string> =>
        await this.getBodyElement().evaluate((el) => el.innerHTML);

    public isSuccessType = async (): Promise<boolean> =>
        this.isToastType("success");

    public isWarningType = async (): Promise<boolean> =>
        this.isToastType("warning");

    public isInfoType = async (): Promise<boolean> => this.isToastType("info");

    public isErrorType = async (): Promise<boolean> => this.isToastType("error");

    /** Wait for countdown timeout and extended timeout only. */
    public waitUntilNotDisplayed = async (
        timeOut: number = ToastAtom.toastTimeout
    ): Promise<void> => {
        await expect(this.root).toBeHidden();
    };

    public getToastsContainerPositioning = async (
        positionClass: string
    ): Promise<boolean> => {
        const classAttr = (await this.container.getAttribute("class")) ?? "";
        return classAttr.split(/\s+/).includes(positionClass);
    };

    public click = async (): Promise<void> => {
        await this.root.click();
    };

    public unhover = async (): Promise<void> => {
        // attempt moving away from container
        const box = await this.container.boundingBox();
        if (box) {
            await Helpers.page.mouse.move(box.x - 5, box.y - 5);
        } else {
            await Helpers.page.mouse.move(0, 0);
        }
    };

    public async isPresent(): Promise<boolean> {
        return (await this.root.count()) > 0;
    }

    public async isDisplayed(): Promise<boolean> {
        return await this.root.isVisible();
    }

    private getBodyElement = (): Locator =>
        this.root.locator(`.${ToastAtom.CSS_CLASS}__content-body`);

    private isToastType = async (type: string): Promise<boolean> =>
        this.hasClass(`${ToastAtom.CSS_CLASS}--${type}`);
}
