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
import { expect } from "../../setup";
import { ButtonAtom } from "../button/button.atom";

export class TextboxNumberAtom extends Atom {
    public static CSS_CLASS = "nui-textbox-number";

    public upButton: ButtonAtom;
    public downButton: ButtonAtom;
    public input: Locator;

    constructor(locator: Locator) {
        super(locator);
        this.upButton = Atom.findIn<ButtonAtom>(
            ButtonAtom,
            locator.locator(".nui-textbox-number__up-button")
        );
        this.downButton = Atom.findIn<ButtonAtom>(
            ButtonAtom,
            locator.locator(".nui-textbox-number__down-button")
        );
        this.input = locator.locator(".nui-textbox__input");
    }

    public async getValue(): Promise<string> {
        return await this.input.inputValue();
    }

    public async getPlaceholder(): Promise<string> {
        return (await this.input.getAttribute("placeholder")) ?? "";
    }

    public async acceptText(text: string): Promise<void> {
        await this.input.click();
        await this.input.fill("");
        await this.input.type(text);
        await this.input.blur();
    }

    public async clearText(): Promise<void> {
        await this.input.fill("");
    }

    public async isDisabled(): Promise<boolean> {
        const disabled = await this.input.isDisabled();
        const upDisabled = await this.upButton.isDisabled();
        const downDisabled = await this.downButton.isDisabled();
        return disabled && upDisabled && downDisabled;
    }

    public async isReadonly(): Promise<boolean> {
        const readonly = await this.input.getAttribute("readonly");
        const upDisabled = await this.upButton.isDisabled();
        const downDisabled = await this.downButton.isDisabled();
        return readonly !== null && upDisabled && downDisabled;
    }

    public async isValid(): Promise<boolean> {
        const classList = await this.getLocator().getAttribute("class");
        return !classList?.includes("has-error");
    }

    public async toBeValid(): Promise<void> {
        await expect(this.getLocator()).not.toHaveClass(/has-error/);
    }

    public async toBeInvalid(): Promise<void> {
        await expect(this.getLocator()).toHaveClass(/has-error/);
    }

    public async toBeDisabled(): Promise<void> {
        await expect(this.input).toBeDisabled();
    }

    public async toBeEnabled(): Promise<void> {
        await expect(this.input).toBeEnabled();
    }
}
