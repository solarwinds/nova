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
import { Atom, IAtomClass } from "../../atom";
import { expect, Helpers } from "../../setup";
import { OverlayAtom } from "../overlay/overlay.atom";

export class BaseSelectV2Atom extends Atom {
    public static findIn<T extends Atom>(
        atomClass: IAtomClass<T>,
        parentLocator: Locator,
        root = true
    ): T {
        return Atom.findIn(atomClass, parentLocator, root);
    }

    public get popup(): OverlayAtom {
        return Atom.findIn<OverlayAtom>(OverlayAtom);
    }

    public async options(): Promise<SelectV2OptionAtom> {
        let parentLocator: Locator;
        if (await this.popup.isOpened()) {
            parentLocator = Helpers.page.locator(
                "body > .cdk-overlay-container .cdk-overlay-pane"
            );
        } else {
            parentLocator = this.getLocator();
        }

        return Atom.findIn<SelectV2OptionAtom>(
            SelectV2OptionAtom,
            parentLocator
        );
    }

    public get input(): Locator {
        return this.getLocator().locator(".nui-select-v2__value");
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

    public async getOption(index: number): Promise<SelectV2OptionAtom> {
        if (!(await this.popup.isOpened())) {
            await this.toggle();
        }

        return (await this.options()).nth<SelectV2OptionAtom>(
            SelectV2OptionAtom,
            index
        );
    }

    public async getFirstOption(): Promise<SelectV2OptionAtom> {
        return this.getOption(0);
    }

    public async getLastOption(): Promise<SelectV2OptionAtom> {
        const count = await (await this.options()).getLocator().count();

        return this.getOption(count - 1);
    }

    public async countOptions(): Promise<number> {
        if (!(await this.popup.isOpened())) {
            await this.toggle();
        }

        return await (await this.options()).getLocator().count();
    }

    /**
     * Note: This method checks whether ANY 'cdk-overlay-pane' on the document body is present
     * (not just this dropdown instance). Close any other cdk-overlay-pane instances before invoking this
     * method to ensure an accurate return value.
     *
     * Important: this is a pure state check (no auto-waits). Prefer toBeOpened/toBeClosed in tests.
     */
    public async isOpened(): Promise<boolean> {
        return this.popup.isOpened();
    }

    public async toBeOpened(): Promise<void> {
        await this.popup.toBeOpened();
    }

    public async toBeClosed(): Promise<void> {
        await this.popup.toNotBeOpened();
    }

    public async toBeHidden(): Promise<void> {
        await this.popup.toBeHidden();
    }

    public async getActiveItemsCount(): Promise<number> {
        return await this.popup.getLocator().locator(".active").count();
    }

    public async type(text: string): Promise<void> {
        await this.click();
        return await this.input.fill(text);
    }

    public async isSelectDisabled(): Promise<void> {
        return await this.toContainClass("disabled");
    }

    public async select(title: string): Promise<void> {
        if (!(await this.popup.isOpened())) {
            await this.toggle();
        }
        // Use Playwright's getByText for exact text match
        const optionsLocator = (await this.options()).getLocator();
        const exactOption = optionsLocator.getByText(title, { exact: true });
        await exactOption.first().click();
    }

    private async waitForPopup() {
        await this.popup.toBeVisible();
    }

    public async toBeDisabled(): Promise<void> {
        await expect(this.getLocator()).toContainClass("disabled");
    }

    public async toBeEnabled(): Promise<void> {
        await expect(this.getLocator()).not.toContainClass("disabled");
    }
}
