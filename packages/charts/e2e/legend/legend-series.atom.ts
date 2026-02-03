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

import { Atom, IAtomClass } from "@nova-ui/bits/sdk/atoms-playwright";

import { RichLegendTileAtom } from "./rich-legend-tile.atom";

export class LegendSeriesAtom extends Atom {
    public static CSS_CLASS = "nui-legend-series";

    public static findIn<T extends Atom>(
        atomClass: IAtomClass<T>,
        parentLocator: Locator,
        root = true
    ): T {
        return Atom.findIn(atomClass, parentLocator, root);
    }

    public richTile: RichLegendTileAtom;

    private readonly deemphasizedOpacity = 0.3;
    private tile: Locator;
    private checkbox: Locator;

    constructor(locator: Locator) {
        super(locator);
        this.richTile = Atom.findIn<RichLegendTileAtom>(
            RichLegendTileAtom,
            this.getLocator()
        );
        this.tile = this.getLocator().locator(
            `.${LegendSeriesAtom.CSS_CLASS}__tile`
        );
        this.checkbox = this.getLocator().locator(
            `.${LegendSeriesAtom.CSS_CLASS}__checkbox-wrapper`
        );
    }

    public async getPrimaryDescriptionText(): Promise<string> {
        return (
            await this.getLocator().locator(".description-primary").innerText()
        ).trim();
    }

    public async getSecondaryDescriptionText(): Promise<string> {
        return (
            await this.getLocator()
                .locator(".description-secondary")
                .innerText()
        ).trim();
    }

    public async getProjectedDescriptionText(): Promise<string> {
        return (
            await this.getLocator().locator("[description]").innerText()
        ).trim();
    }

    public async clickTile(): Promise<void> {
        await this.tile.click({ force: true });
    }

    public async hoverTile(): Promise<void> {
        await this.tile.hover({force: true});
    }

    public async isTileVisible(): Promise<boolean> {
        return this.tile.isVisible();
    }

    public async isCheckboxVisible(): Promise<boolean> {
        return this.checkbox.isVisible();
    }

    public async isCheckboxChecked(): Promise<boolean> {
        const elementClassList = await this.checkbox.getAttribute("class");
        return (
            elementClassList?.includes(
                "nui-legend-series__checkbox--checked"
            ) ?? false
        );
    }

    public async isActive(): Promise<boolean> {
        return this.hasClass("inverse");
    }

    public async isDeemphasized(): Promise<boolean> {
        const deemphasizedElement = this.getLocator().locator(
            `.${LegendSeriesAtom.CSS_CLASS}--state-deemphasized`
        );
        if ((await deemphasizedElement.count()) === 0) {
            return false;
        }

        const opacity = await deemphasizedElement
            .first()
            .evaluate((el) => getComputedStyle(el).opacity);
        return parseFloat(opacity) === this.deemphasizedOpacity;
    }

    public async isDescriptionDeemphasized(): Promise<boolean> {
        const opacity = await this.getLocator()
            .locator(".description-container")
            .evaluate((el) => getComputedStyle(el).opacity);
        return parseFloat(opacity) === this.deemphasizedOpacity;
    }
}
