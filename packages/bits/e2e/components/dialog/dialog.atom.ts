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

import { Helpers, expect } from "../../setup";
import { Atom } from "../../atom";

export class DialogAtom extends Atom {
    public static CSS_CLASS = "modal-dialog";
    public static BACKDROP_CSS_CLASS = "dialog-backdrop";
    public static DIALOG_WINDOW_CSS_CLASS = "nui-dialog";

    // Dismiss a dialog by clicking on 'X' button
    public static async dismissDialog(): Promise<void> {
        return new DialogAtom(Helpers.page.locator(".modal-dialog"))
            .getCloseButton()
            .click();
    }
    public static async toBeVisible(): Promise<void> {
       return await expect(new DialogAtom(Helpers.page.locator(".modal-dialog")).getLocator()).toBeVisible();
    }

    public static async clickCancelButton(): Promise<void> {
        return new DialogAtom(Helpers.page.locator(".modal-dialog"))
            .getCancelButton()
            .click();
    }

    public static async clickActionButton(): Promise<void> {
        return new DialogAtom(Helpers.page.locator(".modal-dialog"))
            .getActionButton()
            .click();
    }

    public getCloseButton = (): Locator =>
        this.getHeader().locator(".nui-button[icon='close']");

    public getHeader(): Locator {
        return super.getLocator().locator(".dialog-header");
    }

    public getFooter(): Locator {
        return super.getLocator().locator(".dialog-footer");
    }

    public getCancelButton(): Locator {
        return super.getLocator().locator(".btn-default");
    }

    public getActionButton(): Locator {
        return super.getLocator().locator(".btn-primary");
    }

    public scrollToEnd = async (): Promise<void> =>
        this.dialog.scrollIntoViewIfNeeded();

    public get dialog(): Locator {
        return super.getLocator().locator(".modal-dialog");
    }

    public async toBeVisible(): Promise<void> {
        await expect(this.dialog).toBeVisible();
    }
}
