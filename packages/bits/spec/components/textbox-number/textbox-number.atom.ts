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

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";

export class TextboxNumberAtom extends Atom {
    public static CSS_CLASS = "nui-textbox-number";

    public upButton: ButtonAtom;
    public downButton: ButtonAtom;
    public input: ElementFinder;

    constructor(private rootElement: ElementFinder) {
        super(rootElement);

        this.upButton = Atom.findIn(
            ButtonAtom,
            rootElement.element(by.className("nui-textbox-number__up-button"))
        );
        this.downButton = Atom.findIn(
            ButtonAtom,
            rootElement.element(by.className("nui-textbox-number__down-button"))
        );
        this.input = rootElement.element(by.className("nui-textbox__input"));
    }

    public getValue = async (): Promise<string> =>
        this.input.getAttribute("value");

    public getPlaceholder = async (): Promise<string> =>
        this.input.getAttribute("placeholder");

    public acceptText = async (text: string): Promise<void> =>
        this.input.sendKeys(text);

    public clearText = async (): Promise<void> => this.input.clear();

    public isDisabled = async (): Promise<boolean> =>
        (await this.input.getAttribute("disabled")) !== null &&
        (await this.upButton.isDisabled()) &&
        (await this.downButton.isDisabled());

    public isReadonly = async (): Promise<boolean> =>
        (await this.input.getAttribute("readonly")) !== null &&
        (await this.upButton.isDisabled()) &&
        (await this.downButton.isDisabled());

    public isValid = async (): Promise<boolean> =>
        !(await this.rootElement.getAttribute("class")).includes("has-error");
}
