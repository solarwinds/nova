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

import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { expect } from "../../setup";

export class RadioGroupAtom extends Atom {
    public static CSS_CLASS = "nui-radio-group";

    /** All radio item locators. */
    public get items(): Locator {
        return this.getLocator().locator(".nui-radio");
    }

    /** All help-hint locators. */
    public get helpHints(): Locator {
        return this.getLocator().locator(".nui-help-hint");
    }

    // --- Actions ---

    /**
     * Select a radio option by its value.
     * Clicks the label wrapper (the actual input is hidden with `appearance: none`).
     */
    public async selectByValue(value: string): Promise<void> {
        // Navigate from input up to the clickable label wrapper
        await this.getLocator()
            .locator(`input[value="${value}"]`)
            .locator("../..")
            .click();
    }

    // --- Locator helpers ---

    /**
     * Returns the radio label wrapper locator for a given value.
     * Useful when tests need to assert text or classes on a specific radio item.
     */
    public getRadioByValue(value: string): Locator {
        return this.getLocator()
            .locator(`input[value="${value}"]`)
            .locator("../..");
    }

    /** Returns the radio input locator for a given value. */
    public getRadioInputByValue(value: string): Locator {
        return this.getLocator().locator(`input[value="${value}"]`);
    }

    // --- Retryable assertions ---

    /** Assert the currently selected radio value. */
    public async toHaveValue(expected: string): Promise<void> {
        await expect(
            this.getLocator().locator("input:checked")
        ).toHaveAttribute("value", expected);
    }

    /** Assert a specific radio is selected (checked). */
    public async toHaveRadioSelected(value: string): Promise<void> {
        await expect(this.getRadioInputByValue(value)).toBeChecked();
    }

    /** Assert a specific radio is NOT selected. */
    public async toHaveRadioNotSelected(value: string): Promise<void> {
        await expect(this.getRadioInputByValue(value)).not.toBeChecked();
    }

    /** Assert the total number of radio items. */
    public async toHaveItemsCount(expected: number): Promise<void> {
        await expect(this.items).toHaveCount(expected);
    }

    /** Assert the number of disabled radio inputs. */
    public async toHaveDisabledItemsCount(expected: number): Promise<void> {
        await expect(
            this.getLocator().locator(".nui-radio__input[disabled]")
        ).toHaveCount(expected);
    }

    /** Assert the help-hint text at a given index. */
    public async toHaveHelpHintText(
        index: number,
        expected: string | RegExp
    ): Promise<void> {
        await expect(this.helpHints.nth(index)).toHaveText(expected);
    }
}
