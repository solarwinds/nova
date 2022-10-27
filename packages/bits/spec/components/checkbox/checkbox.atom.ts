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

import { browser, by, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class CheckboxAtom extends Atom {
    public static CSS_CLASS = "nui-checkbox";

    constructor(element: ElementFinder) {
        super(element);
    }

    public getInputElement(): ElementFinder {
        return super.getElement().element(by.className("nui-checkbox__input"));
    }

    public getLabel(): ElementFinder {
        return super.getElement().element(by.className("nui-checkbox__label"));
    }

    public async getContent(): Promise<string> {
        return super
            .getElement()
            .element(by.className("nui-checkbox__transclude"))
            .getText();
    }

    public async getHelpHintText(): Promise<string> {
        return super
            .getElement()
            .element(by.className("nui-help-hint"))
            .getText();
    }

    public hoverLink = async (): Promise<void> =>
        browser
            .actions()
            .mouseMove(await this.getLink().getWebElement())
            .perform();

    public isIndeterminate = async (): Promise<boolean> =>
        (await this.getInputElement().getAttribute("indeterminate")) === "true";

    public isRequired = async (): Promise<boolean> =>
        (await this.getInputElement().getAttribute("required")) === "true";

    public isDisabled = async (): Promise<boolean> =>
        !(await this.getInputElement().isEnabled());

    public isChecked = async (): Promise<boolean> =>
        (await this.getInputElement().getAttribute("checked")) === "true";

    /**
     * Toggle the checkbox value
     *
     * @returns {Promise<void>}
     */
    public toggle = async (): Promise<void> => this.getMark().click();

    /**
     * Sets the checkbox value to the given value
     *
     * @param {boolean} checked
     * @returns {Promise<void>}
     */
    public async setChecked(checked: boolean): Promise<void> {
        if ((await this.isChecked()) !== checked) {
            return await this.toggle();
        }
    }

    private getMark(): ElementFinder {
        return super.getElement().element(by.className("nui-checkbox__mark"));
    }

    private getLink(): ElementFinder {
        return super.getElement().element(by.className("link-in-checkbox"));
    }
}
