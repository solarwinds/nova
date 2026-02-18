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
import { CheckboxAtom } from "../checkbox/checkbox.atom";

export class RepeatAtom extends Atom {
    public static CSS_CLASS = "nui-repeat";

    public get items(): Locator {
        return this.getLocator().locator(".repeat-group-item");
    }

    public get vScrollViewport(): Locator {
        return this.getLocator().locator(".cdk-virtual-scroll-viewport");
    }

    public get vScrollViewportContent(): Locator {
        return this.getLocator().locator(
            ".cdk-virtual-scroll-content-wrapper"
        );
    }

    public get emptyMessage(): Locator {
        return this.getLocator().locator(
            ".nui-repeat__empty .nui-repeat__empty--main-message"
        );
    }

    public get headerText(): Locator {
        return this.getLocator().locator(".nui-repeat-header");
    }

    public getItem(idx: number): Locator {
        return this.items.nth(idx);
    }

    public getCheckbox(idx: number): CheckboxAtom {
        return new CheckboxAtom(
            this.getItem(idx).locator(".nui-checkbox")
        );
    }

    private getRepeatItem(idx: number): Locator {
        return this.getItem(idx).locator("li.nui-repeat-item");
    }

    // --- Actions ---

    public async selectCheckbox(idx: number): Promise<void> {
        await this.getCheckbox(idx).toggle();
    }

    public async selectCheckboxes(...indexes: number[]): Promise<void> {
        for (const index of indexes) {
            await this.selectCheckbox(index);
        }
    }

    public async selectRow(idx: number): Promise<void> {
        await this.getItem(idx)
            .locator(".nui-repeat-item__content")
            .click();
    }

    public async selectRows(...indexes: number[]): Promise<void> {
        for (const index of indexes) {
            await this.selectRow(index);
        }
    }

    public async selectRadioRow(idx: number): Promise<void> {
        await this.getItem(idx).locator(".nui-repeat-item").click();
    }

    public async selectRadio(idx: number): Promise<void> {
        await this.getItem(idx).locator(".nui-radio").click();
    }

    // --- Retryable assertions ---

    public async toBeNormal(): Promise<void> {
        await this.toContainClass("nui-repeat__normal");
        await this.toNotContainClass("nui-repeat__compact");
    }

    public async toBeCompact(): Promise<void> {
        await this.toContainClass("nui-repeat__compact");
        await this.toNotContainClass("nui-repeat__normal");
    }

    public async toBeStriped(): Promise<void> {
        await expect
            .poll(async () => {
                const first = await this.items
                    .first()
                    .evaluate(
                        (el) => window.getComputedStyle(el).backgroundColor
                    );
                const second = await this.items
                    .nth(1)
                    .evaluate(
                        (el) => window.getComputedStyle(el).backgroundColor
                    );
                return first !== second;
            })
            .toBe(true);
    }

    public async toHaveItemCount(expected: number): Promise<void> {
        await expect(this.items).toHaveCount(expected);
    }

    public async toHaveItemSelected(idx: number): Promise<void> {
        await expect(this.getRepeatItem(idx)).toContainClass(
            "nui-repeat-item--selected"
        );
    }

    public async toNotHaveItemSelected(idx: number): Promise<void> {
        await expect(this.getRepeatItem(idx)).not.toContainClass(
            "nui-repeat-item--selected"
        );
    }

    public async toHaveEmptyTextVisible(): Promise<void> {
        await expect(this.emptyMessage).toBeVisible();
    }

    public async toHaveEmptyText(expected: string | RegExp): Promise<void> {
        await expect(this.emptyMessage).toHaveText(expected);
    }

    public async toHaveHeaderText(expected: string | RegExp): Promise<void> {
        await expect(this.headerText).toHaveText(expected);
    }

    public async toHaveVScrollViewportHeight(
        expected: string | RegExp
    ): Promise<void> {
        await expect(this.vScrollViewport).toHaveCSS("height", expected);
    }

    public async toHaveVScrollViewportContentHeight(
        expected: string | RegExp
    ): Promise<void> {
        await expect(this.vScrollViewportContent).toHaveCSS(
            "height",
            expected
        );
    }
}
