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

import { Atom } from "../../atom";
import { DividerAtom } from "./divider.atom";
import { expect, Helpers, test } from "../../setup";

test.describe("USERCONTROL divider", () => {
    let dividerHorizontalNone: DividerAtom;
    let dividerHorizontalExtraSmall: DividerAtom;
    let dividerHorizontalSmall: DividerAtom;
    let dividerHorizontalMedium: DividerAtom;

    let dividerVerticalNone: DividerAtom;
    let dividerVerticalExtraSmall: DividerAtom;
    let dividerVerticalSmall: DividerAtom;
    let dividerVerticalMedium: DividerAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("divider", page);

        dividerHorizontalNone = Atom.find<DividerAtom>(
            DividerAtom,
            "nui-demo-no-margin-horizontal",
            true
        );
        dividerHorizontalExtraSmall = Atom.find<DividerAtom>(
            DividerAtom,
            "nui-demo-extra-small-horizontal",
            true
        );
        dividerHorizontalSmall = Atom.find<DividerAtom>(
            DividerAtom,
            "nui-demo-small-horizontal",
            true
        );
        dividerHorizontalMedium = Atom.find<DividerAtom>(
            DividerAtom,
            "nui-demo-medium-horizontal",
            true
        );

        dividerVerticalNone = Atom.find<DividerAtom>(
            DividerAtom,
            "nui-demo-no-margin-vertical",
            true
        );
        dividerVerticalExtraSmall = Atom.find<DividerAtom>(
            DividerAtom,
            "nui-demo-extra-small-vertical",
            true
        );
        dividerVerticalSmall = Atom.find<DividerAtom>(
            DividerAtom,
            "nui-demo-small-vertical",
            true
        );
        dividerVerticalMedium = Atom.find<DividerAtom>(
            DividerAtom,
            "nui-demo-medium-vertical",
            true
        );
    });

    test("should apply correct class for horizontal divider", async () => {
        await dividerHorizontalSmall.toBeHorizontal();
    });

    test("should apply correct class for vertical divider", async () => {
        await dividerVerticalSmall.toBeVertical();
    });

    test("should have height 1px if horizontal", async () => {
        await expect(dividerHorizontalSmall.getLocator()).toHaveCSS(
            "height",
            "1px"
        );
    });

    test.describe("horizontal divider sizes", () => {
        test("should be without margins", async () => {
            await dividerHorizontalNone.toContainClass(
                "nui-divider--no-margin"
            );
        });

        test("should have extra-small size", async () => {
            await dividerHorizontalExtraSmall.toContainClass("xs");
        });

        test("should have small size", async () => {
            await dividerHorizontalSmall.toContainClass("sm");
        });

        test("should have medium size", async () => {
            await dividerHorizontalMedium.toContainClass("md");
        });
    });

    test("should have width 1px if vertical", async () => {
        await expect(dividerVerticalMedium.getLocator()).toHaveCSS(
            "width",
            "1px"
        );
    });

    test.describe("vertical divider sizes", () => {
        test("should be without margins", async () => {
            await dividerVerticalNone.toContainClass("nui-divider--no-margin");
        });

        test("should have extra-small size", async () => {
            await dividerVerticalExtraSmall.toContainClass("xs");
        });

        test("should have small size", async () => {
            await dividerVerticalSmall.toContainClass("sm");
        });

        test("should have medium size", async () => {
            await dividerVerticalMedium.toContainClass("md");
        });
    });
});
