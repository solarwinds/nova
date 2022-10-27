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

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ImageAtom } from "../public_api";

xdescribe("USERCONTROL image", () => {
    let floatImage: ImageAtom;
    let marginImage: ImageAtom;
    let customSizeImage: ImageAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("image/image-test");
        floatImage = Atom.find(ImageAtom, "image-float");
        marginImage = Atom.find(ImageAtom, "image-margin");
        customSizeImage = Atom.find(ImageAtom, "image-svg-auto-dimensions");
    });

    it("should render images with predefined float", async () => {
        expect(await floatImage.getFloatings()).toEqual("right");
    });

    it("should render images with predefined margins", async () => {
        expect(await marginImage.hasClass("nui-image__margin-centered")).toBe(
            true
        );
    });

    it("should render custom size images with correct dimensions", async () => {
        expect(await customSizeImage.getWidth()).toBe("100px");
        expect(await customSizeImage.getHeight()).toBe("100px");
    });

    it("should change svg dimensions to 'auto' if 'autoFill' input is used", async () => {
        const svg = customSizeImage.getElement().element(by.tagName("svg"));
        expect(await svg.getAttribute("height")).toEqual("100%");
        expect(await svg.getAttribute("width")).toEqual("100%");
        expect(await svg.getCssValue("height")).toEqual("100px");
        expect(await svg.getCssValue("width")).toEqual("100px");
    });
});
