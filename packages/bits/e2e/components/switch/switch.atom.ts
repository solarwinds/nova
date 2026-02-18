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

import { Locator } from "@playwright/test";

import { Atom } from "../../atom";

export class SwitchAtom extends Atom {
    public static ON_CSS = "nui-switched";
    public static CSS_CLASS = "nui-switch";

    public toggle = async (): Promise<void> => this.slider.click();

    public container(): Locator {
        return super.getLocator().locator(".nui-switch__container");
    }

    public get labelElement(): Locator {
        return super.getLocator().locator(".nui-switch__label");
    }

    public labelText = async (): Promise<string> =>
        (await this.labelElement.textContent()) || "";

    public get slider(): Locator {
        return super.getLocator().locator(".nui-switch__bar");
    }

    public async isOn(): Promise<boolean> {
        return this.hasClass(SwitchAtom.ON_CSS);
    }

    public async isOff(): Promise<boolean> {
        return !(await this.isOn());
    }

    public async isDisabled(): Promise<boolean> {
        return await this.toContainClass("nui-disabled");
    }
    public async isNotDisabled(): Promise<boolean> {
        return await this.toNotContainClass("nui-disabled");
    }

    public async setState(shouldBeOn: boolean): Promise<void> {
        const current = await this.isOn();
        if (current !== shouldBeOn) {
            await this.toggle();
        }
    }
}
