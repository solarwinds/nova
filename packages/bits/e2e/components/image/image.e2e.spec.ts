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

import { ImageAtom } from "./image.atom";
import { Atom } from "../../atom";
import { test, expect, Helpers } from "../../setup";

test.describe("USERCONTROL image", () => {
    let floatImage: ImageAtom;
    let marginImage: ImageAtom;
    let customSizeImage: ImageAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("image/image-test", page);
        floatImage = Atom.find<ImageAtom>(ImageAtom, "image-float");
        marginImage = Atom.find<ImageAtom>(ImageAtom, "image-margin");
        customSizeImage = Atom.find<ImageAtom>(
            ImageAtom,
            "image-svg-auto-dimensions"
        );
    });

    test("should render images with predefined float", async () => {
        await floatImage.toHaveFloat("right");
    });

    test("should render images with predefined margins", async () => {
        await expect(marginImage.getLocator()).toHaveClass(
            /nui-image__margin-centered/
        );
    });

    test("should render custom size images with correct dimensions", async () => {
        await customSizeImage.toHaveWidth("100px");
        await customSizeImage.toHaveHeight("100px");
    });

    test("should change svg dimensions to 'auto' if 'autoFill' input is used", async () => {
        const svg = customSizeImage.getLocator().locator("svg");
        await expect(svg).toHaveAttribute("height", "100%");
        await expect(svg).toHaveAttribute("width", "100%");
        await expect(svg).toHaveCSS("height", "100px");
        await expect(svg).toHaveCSS("width", "100px");
    });
});
