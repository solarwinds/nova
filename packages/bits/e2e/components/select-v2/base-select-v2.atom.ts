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

import { SelectV2OptionAtom } from "./select-v2-option.atom";
import { Atom } from "../../atom";
import { OverlayAtom } from "../overlay/overlay.atom";

export class BaseSelectV2Atom extends Atom {
    public get popup(): OverlayAtom {
        return Atom.findIn<OverlayAtom>(OverlayAtom);
    }
    public get options(): SelectV2OptionAtom {
        return Atom.findIn<SelectV2OptionAtom>(
            SelectV2OptionAtom,
            this.getLocator()
        );
    }

    public get input(): Locator {
        return this.getLocator().locator(".nui-combobox-v2__input");
    }

    public get getPopupElement(): Locator {
        return this.popup.getLocator();
    }

    /**
     * Note: Despite its name, this method will only OPEN the dropdown. To toggle it closed, use this
     * Atom's "click" method.
     */
    public async toggle(): Promise<void> {
        await this.click();
        await this.waitForPopup();
    }

    public async getOption(index: number): SelectV2OptionAtom {
        if (!(await this.popup.isOpened())) {
            await this.toggle();
        }

        return this.options.nth<SelectV2OptionAtom>(SelectV2OptionAtom, index);
    }

    public getFirstOption(): SelectV2OptionAtom {
        return this.getOption(0);
    }

    public async getLastOption(): Promise<SelectV2OptionAtom> {
        const count = await this.options.getLocator().count();

        return this.getOption(count - 1);
    }

    public async countOptions(): Promise<number> {
        if (!(await this.popup.isOpened())) {
            await this.toggle();
        }

        return await this.options.getLocator().count();
    }

    /**
     * Note: This method checks whether ANY 'cdk-overlay-pane' on the document body is present
     * (not just this dropdown instance). Close any other cdk-overlay-pane instances before invoking this
     * method to ensure an accurate return value.
     */
    public async isOpened(): Promise<boolean> {
        await this.waitForPopup();
        return this.popup.isOpened();
    }

    public async getActiveItemsCount(): Promise<number> {
        return await this.popup.getLocator().locator(".active").count();
    }

    public async type(text: string): Promise<void> {
        await this.click();
        return await this.input.press(text);
    }

    public async isSelectDisabled(): Promise<void> {
        return await this.toContainClass("disabled");
    }

    public async select(title: string): Promise<void> {
        if (!(await this.popup.isOpened())) {
            await this.toggle();
        }
        const byText = this.options.filter<SelectV2OptionAtom>(SelectV2OptionAtom, { hasText: title });
        await byText.click();
    }

    private async waitForPopup() {
        await this.popup.toBeVisible();
    }
}
