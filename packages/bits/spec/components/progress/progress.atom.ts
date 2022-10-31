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

import { by } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";

export class ProgressAtom extends Atom {
    public static CSS_CLASS = "nui-progress";

    public getCancelButton = (): ButtonAtom =>
        Atom.findIn(
            ButtonAtom,
            this.getElement().element(by.className("nui-progress__cancel"))
        );

    public canCancel = async (): Promise<boolean> =>
        await this.getCancelButton().isPresent();

    public cancelProgress = async (): Promise<void> =>
        await this.getCancelButton().click();

    public getWidth = async (): Promise<number> =>
        Number(
            (await this.getElement().getCssValue("width")).replace("px", "")
        );

    public getLabel = async (): Promise<string> =>
        await this.getElement()
            .element(by.className("nui-progress__message"))
            .getText();

    public getPercent = async (): Promise<string> =>
        await this.getElement()
            .element(by.className("nui-progress__number"))
            .getText();

    public getOptionalDescription = async (): Promise<string> =>
        await this.getElement()
            .element(by.className("nui-progress__hint"))
            .getText();

    public isProgressBarDisplayed = async (): Promise<boolean> =>
        await this.getElement()
            .element(by.className("nui-progress__bar"))
            .isDisplayed();

    public async isIndeterminate(): Promise<boolean> {
        return await Atom.hasClass(
            this.getElement().element(by.className("nui-progress__bar")),
            "nui-progress--indeterminate"
        );
    }
}
