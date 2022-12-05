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

import { browser, by, ElementFinder, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../../components/button/button.atom";

export class ToastAtom extends Atom {
    public static CSS_CLASS = "nui-toast";
    /** default tiomeout for toast */
    public static toastTimeout = 5000;
    /** time for 'fade out' animation */
    public static animationTimeout = 300;

    private root = this.getElement();
    public container = this.root.element(by.xpath(".."));
    private content = this.root
        .all(by.className(`${ToastAtom.CSS_CLASS}__content`))
        .first();
    public dismiss: ButtonAtom = Atom.findIn(
        ButtonAtom,
        this.content
            .all(by.className(`${ToastAtom.CSS_CLASS}__dismiss-button`))
            .first()
    );

    public getTitle = async (): Promise<string> =>
        this.root
            .element(by.css(`.${ToastAtom.CSS_CLASS}__content-title`))
            .getText();

    public getBody = async (): Promise<string> =>
        this.getBodyElement().getText();

    public getBodyHtml = async (): Promise<string> => {
        const body = this.getBodyElement();
        return body.browser_.executeScript(
            "return arguments[0].innerHTML;",
            body
        );
    };

    public isSuccessType = async (): Promise<boolean> =>
        this.isToastType("success");

    public isWarningType = async (): Promise<boolean> =>
        this.isToastType("warning");

    public isInfoType = async (): Promise<boolean> => this.isToastType("info");

    public isErrorType = async (): Promise<boolean> =>
        this.isToastType("error");

    /** Wait for countdown timout and extended timeout only. No need to wait for fade out animation. Angular will take care of it. */
    public waitUntilNotDisplayed = async (
        timeOut: number = ToastAtom.toastTimeout
    ): Promise<void> =>
        browser.wait(ExpectedConditions.stalenessOf(this.root), timeOut);

    public getToastsContainerPositioning = async (
        positionClass: string
    ): Promise<boolean> => Atom.hasClass(this.container, positionClass);

    public click = async (): Promise<void> => this.root.click();

    public unhover = async (): Promise<void> =>
        browser.actions().mouseMove(this.container, { x: -1, y: -1 }).perform();

    private getBodyElement = (): ElementFinder =>
        this.root.element(by.css(`.${ToastAtom.CSS_CLASS}__content-body`));

    private isToastType = async (type: string): Promise<boolean> =>
        Atom.hasClass(this.root, `${ToastAtom.CSS_CLASS}--${type}`);
}
