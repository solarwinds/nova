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

import { by } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";

export class RichLegendTileAtom extends Atom {
    public static CSS_CLASS = "nui-rich-legend-tile";

    public async getValue(): Promise<string> {
        const valueElements = this.getElement().all(
            by.className("nui-rich-legend-tile__tilebox-value")
        );
        if ((await valueElements.count()) > 0) {
            return valueElements.first().getText();
        }

        // fall back to projected value
        return this.getElement().element(by.css("[value]")).getText();
    }

    public async getUnitLabel(): Promise<string> {
        const unitLabelElements = this.getElement().all(
            by.className("nui-rich-legend-tile__tilebox-unit")
        );
        if ((await unitLabelElements.count()) > 0) {
            return unitLabelElements.first().getText();
        }

        // fall back to projected unit label
        return this.getElement().element(by.css("[unitLabel]")).getText();
    }

    public async isMarkerVisible(): Promise<boolean> {
        const marker = this.getElement().element(
            by.className("nui-rich-legend-tile__point-marker")
        );
        return marker.isDisplayed();
    }

    public async isIconVisible(): Promise<boolean> {
        const icon = this.getElement().element(
            by.className("nui-rich-legend-tile__icon")
        );
        return icon.isDisplayed();
    }

    public async getBackgroundColor(): Promise<string> {
        return this.getElement()
            .element(by.className("nui-rich-legend-tile__tilebox"))
            .getCssValue("background-color");
    }
}
