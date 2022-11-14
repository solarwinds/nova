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
import { IconAtom } from "../icon/icon.atom";

export class MessageAtom extends Atom {
    public static CSS_CLASS = "nui-message";
    public static animationDuration = 300;
    private root = this.getElement();

    public getDismissButton = (): ElementFinder =>
        this.root.element(by.className("nui-message-dismiss-button"));

    public dismissMessage = async (): Promise<void | null> => {
        const button = this.getDismissButton();
        if (!(await button.isDisplayed())) {
            return null;
        }
        await button.click();
        return browser.wait(
            ExpectedConditions.invisibilityOf(this.root),
            MessageAtom.animationDuration * 1.5
        );
    };

    public isVisible = async (): Promise<boolean> => this.root.isDisplayed();

    public isDismissable = async (): Promise<boolean> =>
        this.getDismissButton().isDisplayed();

    public getBorderStyle = async (): Promise<string> =>
        this.root.getCssValue("border-color");

    public getStatusIcon = (): IconAtom =>
        Atom.findIn(
            IconAtom,
            this.getElement().element(by.className("nui-message-icon"))
        );

    public getBackgroundColor = async (): Promise<string> =>
        this.root.getCssValue("background-color");

    public getContent = async (): Promise<string> =>
        this.root.element(by.className("nui-message-content")).getText();
}
