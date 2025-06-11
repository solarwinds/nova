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

import { IconAtom } from "./icon.atom";
import { Atom } from "../../atom";
import { test, Helpers, expect } from "../../setup";

test.describe("USERCONTROL icon", () => {
    test.beforeEach(async ({page}) => {
        await Helpers.prepareBrowser("icon", page);
    });

    test("should show each available icon size on the page", async () => {
        const smallIcon = Atom.find<IconAtom>(IconAtom, "nui-demo-icon-small");
        expect(await smallIcon.getSize()).toEqual(IconAtom.iconSize.small);

        const defaultIcon = Atom.find<IconAtom>(
            IconAtom,
            "nui-demo-icon-default-size"
        );
        expect(await defaultIcon.getSize()).toEqual(IconAtom.iconSize.default);

        const mediumIcon = Atom.find<IconAtom>(
            IconAtom,
            "nui-demo-icon-medium-size"
        );
        expect(await mediumIcon.getSize()).toEqual(IconAtom.iconSize.medium);
    });

    test("should show icons with status on the page", async () => {
        const atom = Atom.find<IconAtom>(
            IconAtom,
            "nui-demo-icon-with-status-up"
        );
        expect(await atom.getStatus()).toEqual("up");
    });

    test("should show icons with valid counters on the page", async () => {
        const atom = Atom.find<IconAtom>(
            IconAtom,
            "nui-demo-icon-with-counter"
        );
        expect(await atom.getCounter()).toEqual("6");
    });

    test("should have 'icon' attr congruent to the 'icon' prop binding", async () => {
        const statusIcon = Atom.find<IconAtom>(
            IconAtom,
            "nui-demo-icon-with-status-up"
        );
        expect(await statusIcon.getName()).toEqual("add");
        const addIcon = Atom.find<IconAtom>(IconAtom, "nui-demo-icon-small");
        expect(await addIcon.getName()).toEqual("add");
    });

    test("should recolor icon to orange color", async () => {
        const iconColor = Atom.find<IconAtom>(IconAtom, "nui-demo-icon-color");
        expect(iconColor.getIconByCssClass("orange-icon")).toBeTruthy();
    });

    test("should recolor icon on hover effect to gray color", async () => {
        const iconHover = Atom.find<IconAtom>(IconAtom, "nui-demo-icon-hover");
        expect(iconHover.getIconByCssClass("gray-hover-icon")).toBeTruthy();
    });
});
