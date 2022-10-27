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
import { LayoutSheetAtom, LayoutSheetGroupAtom } from "../public_api";

describe("LAYOUT", () => {
    let sheetGroupInner: LayoutSheetGroupAtom;
    let sheetGroupOuter: LayoutSheetGroupAtom;
    let sheet: LayoutSheetAtom;

    beforeEach(async () => {
        await Helpers.prepareBrowser("layout/layout-test");
        sheetGroupInner = Atom.find(
            LayoutSheetGroupAtom,
            "nui-demo-sheet-group--inner"
        );
        sheetGroupOuter = Atom.find(
            LayoutSheetGroupAtom,
            "nui-demo-sheet-group--outer"
        );
        sheet = Atom.find(LayoutSheetAtom, "nui-demo-sheet-group__sheet");
    });

    it("should resize right sheet border", async () => {
        const amountToResizeToTheRight = 200;
        const sheetWidthBefore = await sheet.getWidth();
        await sheetGroupInner.moveRightHorizontalResizerByIndex(
            1,
            amountToResizeToTheRight
        );
        const sheetWidthAfter = await sheet.getWidth();
        expect(sheetWidthAfter).toBe(
            sheetWidthBefore + amountToResizeToTheRight
        );
    });

    it("should resize left sheet border", async () => {
        const amountToResizeToTheLeft = 200;
        const sheetWidthBefore = await sheet.getWidth();
        await sheetGroupInner.moveLeftHorizontalResizerByIndex(
            0,
            amountToResizeToTheLeft
        );
        const sheetWidthAfter = await sheet.getWidth();
        expect(sheetWidthAfter).toBe(
            sheetWidthBefore + amountToResizeToTheLeft
        );
    });

    it("should resize upwards sheet-group border", async () => {
        const amountToResizeToTheTop = 200;
        const sheetHeightBefore = await sheet.getHeight();
        await sheetGroupOuter.moveUpVerticalResizerByIndex(
            0,
            amountToResizeToTheTop
        );
        const sheetHeightAfter = await sheet.getHeight();
        expect(sheetHeightAfter).toBe(
            sheetHeightBefore + amountToResizeToTheTop
        );
    });

    it("should resize downwards sheet-group border", async () => {
        const amountToResizeToTheTop = 100;
        const sheetHeightBefore = await sheet.getHeight();
        await sheetGroupOuter.moveDownVerticalResizerByIndex(
            0,
            amountToResizeToTheTop
        );
        const sheetHeightAfter = await sheet.getHeight();
        expect(sheetHeightAfter).toBe(
            sheetHeightBefore - amountToResizeToTheTop
        );
    });
});
