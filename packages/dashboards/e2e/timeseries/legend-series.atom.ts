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

import { Locator } from "@playwright/test";

import {
    Atom,
    ButtonAtom,
    IconAtom,
    MenuItemAtom,
} from "@nova-ui/bits/sdk/atoms-playwright";

export class LegendSeriesAtom extends Atom {
    public static CSS_CLASS = "nui-legend-series";

    public getMenuButton(): ButtonAtom {
        return Atom.findIn<ButtonAtom>(ButtonAtom, this.getLocator());
    }

    public getTransformIcon(): IconAtom {
        // Exclude the icon inside the menu button — target only the
        // transform indicator icon that lives outside ".legend-menu"
        const locator = this.getLocator().locator(
            `.${IconAtom.CSS_CLASS}:not(.legend-menu .${IconAtom.CSS_CLASS})`
        );
        return new IconAtom(locator);
    }

    public async getTransform(
        transformName: string
    ): Promise<MenuItemAtom | undefined> {
        // Hover the legend and click the menu button to open the menu
        await this.hover();
        await this.getMenuButton().click();

        // Find the "Display Transforms" group and its menu items
        const group = this.getTransformGroup();
        const items = group.locator(`.${MenuItemAtom.CSS_CLASS}`);
        const count = await items.count();

        // Skip the first item (header) and find the matching transform
        for (let i = 1; i < count; i++) {
            const itemLocator = items.nth(i);
            const text = await itemLocator.innerText();
            if (text === transformName) {
                return Atom.findIn<MenuItemAtom>(
                    MenuItemAtom,
                    itemLocator,
                    true
                );
            }
        }
    }

    private getTransformGroup(): Locator {
        return this.getLocator()
            .page()
            .locator("nui-menu-group[header='Display Transforms']");
    }
}
