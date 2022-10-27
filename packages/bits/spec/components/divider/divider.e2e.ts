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
import { Helpers } from "../../helpers";
import { DividerAtom } from "../public_api";

describe("USERCONTROL divider", () => {
    let dividerHorizontalNone: DividerAtom;
    let dividerHorizontalExtraSmall: DividerAtom;
    let dividerHorizontalSmall: DividerAtom;
    let dividerHorizontalMedium: DividerAtom;

    let dividerVerticalNone: DividerAtom;
    let dividerVerticalExtraSmall: DividerAtom;
    let dividerVerticalSmall: DividerAtom;
    let dividerVerticalMedium: DividerAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("divider");

        dividerHorizontalNone = Atom.find(
            DividerAtom,
            "nui-demo-no-margin-horizontal"
        );
        dividerHorizontalExtraSmall = Atom.find(
            DividerAtom,
            "nui-demo-extra-small-horizontal"
        );
        dividerHorizontalSmall = Atom.find(
            DividerAtom,
            "nui-demo-small-horizontal"
        );
        dividerHorizontalMedium = Atom.find(
            DividerAtom,
            "nui-demo-medium-horizontal"
        );

        dividerVerticalNone = Atom.find(
            DividerAtom,
            "nui-demo-no-margin-vertical"
        );
        dividerVerticalExtraSmall = Atom.find(
            DividerAtom,
            "nui-demo-extra-small-vertical"
        );
        dividerVerticalSmall = Atom.find(
            DividerAtom,
            "nui-demo-small-vertical"
        );
        dividerVerticalMedium = Atom.find(
            DividerAtom,
            "nui-demo-medium-vertical"
        );
    });

    it("should apply correct class for horizontal divider", async () => {
        expect(await dividerHorizontalSmall.isHorizontal()).toEqual(true);
        expect(await dividerHorizontalSmall.isVertical()).toEqual(false);
    });

    it("should apply correct class for vertical divider", async () => {
        expect(await dividerVerticalSmall.isVertical()).toEqual(true);
        expect(await dividerVerticalSmall.isHorizontal()).toEqual(false);
    });

    it("should have height 1px if horizontal", async () => {
        const el = dividerHorizontalSmall.getElement();
        expect(await el.getCssValue("height")).toEqual("1px");
    });

    describe("horizontal divider sizes", () => {
        it("should be without margins", async () => {
            expect(
                await dividerHorizontalNone.hasClass("nui-divider--no-margin")
            ).toBe(true);
        });

        it("should have extra-small size", async () => {
            expect(await dividerHorizontalExtraSmall.hasClass("xs")).toBe(true);
        });

        it("should have small size", async () => {
            expect(await dividerHorizontalSmall.hasClass("sm")).toBe(true);
        });

        it("should have medium size", async () => {
            expect(await dividerHorizontalMedium.hasClass("md")).toBe(true);
        });
    });

    it("should have width 1px if vertical", async () => {
        const el = dividerVerticalMedium.getElement();
        expect(await el.getCssValue("width")).toEqual("1px");
    });

    describe("vertical divider sizes", () => {
        it("should be without margins", async () => {
            expect(
                await dividerVerticalNone.hasClass("nui-divider--no-margin")
            ).toBe(true);
        });

        it("should have extra-small size", async () => {
            expect(await dividerVerticalExtraSmall.hasClass("xs")).toBe(true);
        });

        it("should have small size", async () => {
            expect(await dividerVerticalSmall.hasClass("sm")).toBe(true);
        });

        it("should have medium size", async () => {
            expect(await dividerVerticalMedium.hasClass("md")).toBe(true);
        });
    });
});
