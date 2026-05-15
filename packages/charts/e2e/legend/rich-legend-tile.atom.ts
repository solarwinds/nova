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

import { Atom } from "@nova-ui/bits/sdk/atoms-playwright";

export class RichLegendTileAtom extends Atom {
    public static CSS_CLASS = "nui-rich-legend-tile";

    public async getValue(): Promise<string> {
        const valueElements = this.getLocator().locator(
            ".nui-rich-legend-tile__tilebox-value"
        );
        if ((await valueElements.count()) > 0) {
            return (await valueElements.first().innerText()).trim();
        }

        // fall back to projected value
        return (await this.getLocator().locator("[value]").innerText()).trim();
    }

    public async getUnitLabel(): Promise<string> {
        const unitLabelElements = this.getLocator().locator(
            ".nui-rich-legend-tile__tilebox-unit"
        );
        if ((await unitLabelElements.count()) > 0) {
            return (await unitLabelElements.first().innerText()).trim();
        }

        // fall back to projected unit label
        return (
            await this.getLocator().locator("[unitLabel]").innerText()
        ).trim();
    }

    public async isMarkerVisible(): Promise<boolean> {
        const marker = this.getLocator().locator(
            ".nui-rich-legend-tile__point-marker"
        );
        return marker.isVisible();
    }

    public async isIconVisible(): Promise<boolean> {
        const icon = this.getLocator().locator(".nui-rich-legend-tile__icon");
        return icon.isVisible();
    }

    public async getBackgroundColor(): Promise<string> {
        return this.getLocator()
            .locator(".nui-rich-legend-tile__tilebox")
            .evaluate((el) => getComputedStyle(el).backgroundColor);
    }
}
