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

import { browser, by, ExpectedConditions } from "protractor";
import { ISize } from "selenium-webdriver";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";

export class SpinnerAtom extends Atom {
    public static CSS_CLASS = "nui-spinner";
    public static defaultDelay = 250;

    private root = this.getElement();

    public getSize = async (): Promise<ISize> => this.root.getSize();

    public waitForDisplayed = async (
        timeout: number = SpinnerAtom.defaultDelay * 1.5
    ): Promise<void> =>
        browser.wait(
            ExpectedConditions.visibilityOf(this.root),
            timeout,
            "Spinner was not displayed in time"
        );

    public waitForHidden = async (
        timeout: number = SpinnerAtom.defaultDelay * 1.5
    ): Promise<void> =>
        browser.wait(
            ExpectedConditions.stalenessOf(this.root),
            timeout,
            "Spinner was not hidden in time"
        );

    public getLabel = async (): Promise<string> =>
        this.root.element(by.css(".nui-spinner__message")).getText();

    public cancel = async (): Promise<void> =>
        Atom.findIn(ButtonAtom, this.root).click();
}
