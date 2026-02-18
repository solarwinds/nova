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

import { by, ElementFinder } from "protractor";

import { Atom } from "../atom";

export class SwitchAtom extends Atom {
    public static ON_CSS = "nui-switched";
    public static CSS_CLASS = "nui-switch";

    public toggle = async (): Promise<void> => this.slider().click();

    public container(): ElementFinder {
        return super
            .getElement()
            .element(by.className("nui-switch__container"));
    }

    public labelElement(): ElementFinder {
        return super.getElement().element(by.className("nui-switch__label"));
    }

    public labelText = async (): Promise<string> =>
        this.labelElement().getText();

    public slider(): ElementFinder {
        return super.getElement().element(by.className("nui-switch__bar"));
    }

    public async isOn(): Promise<boolean> {
        return super.hasClass(SwitchAtom.ON_CSS);
    }

    public async disabled(): Promise<boolean> {
        return super
            .getElement()
            .getAttribute("class")
            .then((classString) => classString.indexOf("disabled") !== -1);
    }

    public async setState(shouldBeOn: boolean): Promise<void> {
        const current = await this.isOn();
        if (current !== shouldBeOn) {
            await this.toggle();
        }
    }
}
