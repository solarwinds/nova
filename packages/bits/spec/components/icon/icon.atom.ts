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

import { by, ElementArrayFinder, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export enum IconSize {
    small,
    default,
    medium,
}

export class IconAtom extends Atom {
    public static CSS_CLASS = "nui-icon";

    public static iconSize = {
        small: "sm",
        default: "default",
        medium: "md",
    };

    static count = async (
        item: ElementFinder,
        extStyle = ""
    ): Promise<number> => item.all(by.css(".nui-icon" + extStyle)).count();

    public async getName(): Promise<string> {
        return super.getElement().getAttribute("icon");
    }

    public async getStatus(): Promise<string> {
        return super.getElement().getAttribute("status");
    }

    public async getCounter(): Promise<string> {
        return super.getElement().getAttribute("counter");
    }

    public getIconByCssClass(cssClass: string): ElementArrayFinder {
        return super.getElement().all(by.className(cssClass));
    }

    public async getSize(): Promise<string> {
        return super
            .getElement()
            .getAttribute("class")
            .then(async (css: string) => {
                if (css.search(IconAtom.iconSize.small) !== -1) {
                    return IconAtom.iconSize.small;
                } else if (css.search(IconAtom.iconSize.medium) !== -1) {
                    return IconAtom.iconSize.medium;
                } else {
                    return IconAtom.iconSize.default;
                }
            });
    }
}
