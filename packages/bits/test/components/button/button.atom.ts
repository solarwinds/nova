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

import { Atom } from "../../atom";
import { browser } from "@wdio/globals";

export class ButtonAtom extends Atom {
    public static CSS_CLASS = "nui-button";

    private root = this.getElement();

    public click = async (): Promise<void> => this.root.click();

    public getText = async (): Promise<string> =>
        this.root.$(".nui-button__content").getText();

    public isDisabled = async (): Promise<boolean> =>
        !(await this.root.isEnabled());

    public isVisible = async (): Promise<boolean> => this.isDisplayed();

    public isBusy = async (): Promise<boolean> => this.hasClass("is-busy");

    public getTextColor = async (): Promise<string | undefined> =>
        this.root.getCSSProperty("color").then(e=>e.value);

    public getBackgroundColor = async (): Promise<string|undefined> =>
        this.root.getCSSProperty("background-color").then(e=>e.value);

    public getBorderStyle = async (): Promise<string|undefined> =>
        this.root.getCSSProperty("border-color").then(e=>e.value);

    // public mouseDown = async (): Promise<void> => {
    //     const rootWebElement = this.root;
    //     await rootWebElement.moveTo();  // Move the mouse to the element
    //     // browser.buttonDown(0);
    //
    //     await rootWebElement.click({skipRelease: true});  // Perform mouse down action
    //
    // };
    //
    // public mouseUp = async (): Promise<void> => {
    //     const rootWebElement = await this.root.getWebElement();
    //     await browser.actions().mouseMove(rootWebElement).perform();
    //     return browser.actions().mouseUp().perform();
    // };
    //
    public isIconShown = async (): Promise<boolean> =>
        this.root.$(".nui-icon").isExisting();

    // public getIcon = (): IconAtom => Atom.findIn(IconAtom, this.root);
    //
    // public async mouseDownAndHold(ms: number): Promise<void> {
    //     await this.mouseDown();
    //     await browser.sleep(ms);
    //     await this.mouseUp();
    //     return;
    // }
}
