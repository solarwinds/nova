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

import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class DialogAtom extends Atom {
    public static CSS_CLASS = "modal-dialog";
    public static BACKDROP_CSS_CLASS = "dialog-backdrop";
    public static DIALOG_WINDOW_CSS_CLASS = "nui-dialog";

    // Dismiss a dialog by clicking on 'X' button

    public static async dismissDialog(): Promise<void> {
        return new DialogAtom(element(by.className("modal-dialog")))
            .getCloseButton()
            .click();
    }

    public static async clickCancelButton(): Promise<void> {
        return new DialogAtom(element(by.className("modal-dialog")))
            .getCancelButton()
            .click();
    }

    public static async clickActionButton(): Promise<void> {
        return new DialogAtom(element(by.className("modal-dialog")))
            .getActionButton()
            .click();
    }

    public isDialogDisplayed = async (): Promise<boolean> =>
        this.getDialog().isPresent();

    public getCloseButton = (): ElementFinder =>
        this.getHeader().element(by.css(".nui-button[icon='close']"));

    public getHeader(): ElementFinder {
        return super.getElement().element(by.className("dialog-header"));
    }

    public getFooter(): ElementFinder {
        return super.getElement().element(by.className("dialog-footer"));
    }

    public getCancelButton(): ElementFinder {
        return super.getElement().element(by.className("btn-default"));
    }

    public getActionButton(): ElementFinder {
        return super.getElement().element(by.className("btn-primary"));
    }

    public scrollToEnd = async (): Promise<void> =>
        browser.executeScript<void>(
            `arguments[0].scrollIntoView({block: "end"})`,
            this.getDialog()
        );

    public getDialog(): ElementFinder {
        return super.getElement().element(by.className("modal-dialog"));
    }
}
