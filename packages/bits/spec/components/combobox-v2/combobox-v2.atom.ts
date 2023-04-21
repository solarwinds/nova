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
import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { IconAtom } from "../icon/icon.atom";
import { OverlayAtom } from "../overlay/overlay.atom";
import { BaseSelectV2Atom } from "../select-v2/base-select-v2.atom";

export class ComboboxV2Atom extends BaseSelectV2Atom {
    public static CSS_CLASS = "nui-combobox-v2";
    public static async type(text: string): Promise<void> {
        return browser.actions().sendKeys(text).perform();
    }

    public popup: OverlayAtom = Atom.findIn(
        OverlayAtom,
        element(by.className("combobox-v2-test-pane"))
    );
    public removeAllButton = this.getElement().element(
        by.className("nui-combobox-v2__remove-value")
    );
    public createOption = this.getPopupElement().element(
        by.className("nui-combobox-v2__create-option")
    );
    public toggleButton = this.getElement().element(
        by.className("nui-combobox-v2__toggle")
    );
    public chips = this.getElement().all(by.css("nui-chip"));
    public activeChip = this.getElement().element(by.css("nui-chip.active"));
    public activeOption = this.getPopupElement().element(
        by.css("nui-select-v2-option.active")
    );

    public async removeAll(): Promise<void> {
        return this.removeAllButton.click();
    }

    public async removeChips(amount: number): Promise<void> {
        this.chips.each(async (chip?: ElementFinder, i?: number) => {
            if (!chip || isNil(i)) {
                throw new Error("chip is not defined");
            }
            if (amount > i) {
                await Atom.findIn(IconAtom, chip).getElement().click();
            }
        });
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
        return this.input.getAttribute("value");
    }

    public async getSelectionStart(): Promise<number> {
        return await browser.executeScript(
            "return arguments[0].selectionStart",
            await this.input.getWebElement()
        );
    }

    public async getSelectionEnd(): Promise<number> {
        return await browser.executeScript(
            "return arguments[0].selectionEnd",
            await this.input.getWebElement()
        );
    }

    public async getSelectionRange(): Promise<number> {
        return (
            (await this.getSelectionEnd()) - (await this.getSelectionStart())
        );
    }
}
