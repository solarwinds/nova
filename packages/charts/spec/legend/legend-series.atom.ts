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

import { Atom } from "@nova-ui/bits/sdk/atoms";

import { RichLegendTileAtom } from "./rich-legend-tile.atom";

export class LegendSeriesAtom extends Atom {
    public static CSS_CLASS = "nui-legend-series";
    public richTile;

    private readonly deemphasizedOpacity = 0.3;
    private tile;
    private checkbox;

    constructor(private root: ElementFinder) {
        super(root);
        this.richTile = Atom.findIn(
            RichLegendTileAtom,
            this.root.element(by.className(RichLegendTileAtom.CSS_CLASS))
        );
        this.tile = this.root.element(
            by.className(`${LegendSeriesAtom.CSS_CLASS}__tile`)
        );
        this.checkbox = this.root.element(
            by.className(`${LegendSeriesAtom.CSS_CLASS}__checkbox-wrapper`)
        );
    }

    public async getPrimaryDescriptionText(): Promise<string> {
        return this.root.element(by.className("description-primary")).getText();
    }

    public async getSecondaryDescriptionText(): Promise<string> {
        return this.root
            .element(by.className("description-secondary"))
            .getText();
    }

    public async getProjectedDescriptionText(): Promise<string> {
        return this.root.element(by.css("[description]")).getText();
    }

    public clickTile = async (): Promise<void> => this.tile.click();

    public hoverTile = async (): Promise<void> => this.hover(this.tile);

    public isTileVisible = async (): Promise<boolean> =>
        this.tile.isDisplayed();

    public isCheckboxVisible = async (): Promise<boolean> =>
        this.checkbox.isDisplayed();

    public async isCheckboxChecked(): Promise<boolean> {
        const elementClassList = await this.checkbox.getAttribute("class");
        return elementClassList.includes(
            "nui-legend-series__checkbox--checked"
        );
    }

    public isActive = async (): Promise<boolean> => this.hasClass("inverse");

    public async isDeemphasized(): Promise<boolean> {
        const deemphasizedElements = this.root.all(
            by.className(`${LegendSeriesAtom.CSS_CLASS}--state-deemphasized`)
        );
        if ((await deemphasizedElements.count()) === 0) {
            return false;
        }

        return (
            parseFloat(
                await deemphasizedElements.first().getCssValue("opacity")
            ) === this.deemphasizedOpacity
        );
    }

    public async isDescriptionDeemphasized(): Promise<boolean> {
        return (
            parseFloat(
                await this.root
                    .element(by.className("description-container"))
                    .getCssValue("opacity")
            ) === this.deemphasizedOpacity
        );
    }
}
