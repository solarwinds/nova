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

import isNil from "lodash/isNil";
import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { Helpers, expect } from "../../setup";
import { IconAtom } from "../icon/icon.atom";
import { BaseSelectV2Atom } from "../select-v2/base-select-v2.atom";

export class ComboboxV2Atom extends BaseSelectV2Atom {
    public static CSS_CLASS = "nui-combobox-v2";

    public get input(): Locator {
        return this.getLocator().locator(".nui-combobox-v2__input");
    }

    public static async type(text: string): Promise<void> {
        await Helpers.page.keyboard.type(text);
    }

    public removeAllButton: Locator = this.getLocator().locator(
        ".nui-combobox-v2__remove-value"
    );

    public get createOption(): Locator {
        return this.getPopupElement.locator(
            ".nui-combobox-v2__create-option"
        );
    }

    public toggleButton: Locator = this.getLocator().locator(
        ".nui-combobox-v2__toggle"
    );

    public chips: Locator = this.getLocator().locator("nui-chip");
    public activeChip: Locator = this.getLocator().locator("nui-chip.active");
    public get activeOption(): Locator {
        return this.getPopupElement.locator("nui-select-v2-option.active");
    }

    public async removeAll(): Promise<void> {
        await this.removeAllButton.click();
    }

    public async removeChips(amount: number): Promise<void> {
        const count = await this.chips.count();
        for (let i = 0; i < count && i < amount; i++) {
            const chip = this.chips.first();
            if (!chip) {
                throw new Error("chip is not defined");
            }
            await Atom.findIn<IconAtom>(IconAtom, chip).getLocator().click();
        }
    }

    public async selectAll(): Promise<void> {
        await this.selectFirst(await this.countOptions());
    }

    public async selectFirst(numberOfItems?: number): Promise<void> {
        let index = numberOfItems || 1;
        while (index > 0) {
            index--;
            await (await this.getOption(index)).click();
        }
    }

    public async getInputValue(): Promise<string> {
        return (await this.input.inputValue()) ?? "";
    }

    public async getSelectionStart(): Promise<number> {
        const start = await this.input.evaluate((el: HTMLInputElement) => el.selectionStart);
        return isNil(start) ? 0 : start;
    }

    public async getSelectionEnd(): Promise<number> {
        const end = await this.input.evaluate((el: HTMLInputElement) => el.selectionEnd);
        return isNil(end) ? 0 : end;
    }

    public async getSelectionRange(): Promise<number> {
        return (await this.getSelectionEnd()) - (await this.getSelectionStart());
    }

    public async waitElementVisible(): Promise<void> {
        await expect(this.getLocator().first()).toBeVisible();
    }
}
