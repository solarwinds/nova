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

import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { IconAtom } from "../icon/icon.atom";

export class ButtonAtom extends Atom {
    public static CSS_CLASS = "nui-button";

    private root = this.getElement();

    public click = async (): Promise<void> => this.root.click();

    public getText = async (): Promise<string> =>
        this.root.element(by.className("nui-button__content")).getText();

    public isDisabled = async (): Promise<boolean> =>
        !(await this.root.isEnabled());

    public isVisible = async (): Promise<boolean> => this.isDisplayed();

    public isBusy = async (): Promise<boolean> => this.hasClass("is-busy");

    public getTextColor = async (): Promise<string> =>
        this.root.getCssValue("color");

    public getBackgroundColor = async (): Promise<string> =>
        this.root.getCssValue("background-color");

    public getBorderStyle = async (): Promise<string> =>
        this.root.getCssValue("border-color");

    public mouseDown = async (): Promise<void> => {
        const rootWebElement = await this.root.getWebElement();
        await browser.actions().mouseMove(rootWebElement).perform();
        return browser.actions().mouseDown().perform();
    };

    public mouseUp = async (): Promise<void> => {
        const rootWebElement = await this.root.getWebElement();
        await browser.actions().mouseMove(rootWebElement).perform();
        return browser.actions().mouseUp().perform();
    };

    public isIconShown = async (): Promise<boolean> =>
        this.root.element(by.className("nui-icon")).isPresent();

    public getIcon = async (): Promise<IconAtom | undefined> =>
        (await Atom.findCount(IconAtom, this.root))
            ? Atom.findIn(IconAtom, this.root)
            : undefined;

    public async mouseDownAndHold(ms: number): Promise<void> {
        await this.mouseDown();
        await browser.sleep(ms);
        await this.mouseUp();
        return;
    }
}
