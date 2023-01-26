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

import { ElementFinder, browser, by, element } from "protractor";

import {
    Atom,
    ButtonAtom,
    IconAtom,
    MenuAtom,
    MenuItemAtom,
} from "@nova-ui/bits/sdk/atoms";

export class LegendSeriesAtom extends Atom {
    public static CSS_CLASS = "nui-legend-series";

    private root = this.getElement();

    public async getValue(): Promise<string> {
        return await this.root
            .all(by.className("nui-rich-legend-tile"))
            .first()
            .getText();
    }

    public async getDescriptionPrimary(): Promise<string> {
        return await this.root
            .all(by.className("description-primary"))
            .first()
            .getText();
    }

    public async getDescriptionSecondary(): Promise<string> {
        return await this.root
            .all(by.className("description-secondary"))
            .first()
            .getText();
    }

    public getMenuButton(): ButtonAtom {
        return Atom.findIn(ButtonAtom, this.root);
    }

    public getTransformIcon(): IconAtom {
        return Atom.findIn(IconAtom, this.root);
    }

    public async getTransform(
        transformName: string
    ): Promise<MenuItemAtom | undefined> {
        // opens legend menu
        await this.hover();
        await this.getMenuButton().click();

        const group = this.getTransformGroup();
        const count = await Atom.findCount(MenuItemAtom, group);

        const transforms = new Array(count)
            .fill(0)
            .map((_, index) => Atom.findIn(MenuItemAtom, group, index))
            .slice(1);

        for (const transform of transforms) {
            if ((await transform.getElement().getText()) === transformName) {
                return transform;
            }
        }
    }

    private getTransformGroup(): ElementFinder {
        return element(
            by.xpath("//nui-menu-group[@header='Display Transforms']")
        );
    }
}
