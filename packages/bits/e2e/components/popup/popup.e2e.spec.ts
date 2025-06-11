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

import { PopupAtom } from "./popup.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";

test.describe("USERCONTROL Popup", () => {
    let popupSimple: PopupAtom;
    let popupCustomWidth: PopupAtom;
    let popupIsOpened: PopupAtom;
    let popupAppendToBody: PopupAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("popup/popup-test", page);
        popupSimple = Atom.find<PopupAtom>(PopupAtom, "nui-demo-popup-simple");
        popupCustomWidth = Atom.find<PopupAtom>(
            PopupAtom,
            "nui-demo-popup-custom-width"
        );
        popupIsOpened = Atom.find<PopupAtom>(
            PopupAtom,
            "nui-demo-popup-isOpen-true"
        );
        popupAppendToBody = Atom.find<PopupAtom>(
            PopupAtom,
            "nui-demo-popup-append-to-body"
        );
    });

    test("should respect the isOpen Input", async () => {
        await popupIsOpened.isOpened();
    });

    test("should be opened/closed on click event", async () => {
        await popupSimple.getPopupToggle.click();
        await popupSimple.isOpened();

        await popupSimple.getPopupToggle.click();
        await popupSimple.isNotOpened();
    });

    test("should be closed when other popup is opened", async () => {
        await popupSimple.open();
        await popupCustomWidth.open();

        await popupSimple.isNotOpened();
        await popupCustomWidth.isOpened();
    });

    test("should be closed if click outside the popup", async () => {
        await popupSimple.open();
        await Helpers.clickOnEmptySpace();
        await popupSimple.isNotOpened();
    });

    test("should attach container to body", async () => {
        await popupAppendToBody.open(true);
        await popupAppendToBody.isOpenedAppendToBody();
    });

    test("should detach container from body when closed", async () => {
        await popupAppendToBody.open(true);
        await popupAppendToBody.isOpenedAppendToBody();
        await Helpers.clickOnEmptySpace();
        await popupAppendToBody.isNotOpenedAppendToBody();
    });

    test("should respect context class", async () => {
        await popupAppendToBody.open(true);
        await expect(popupAppendToBody.getPopupBoxDetached).toHaveClass(
            "nui-overlay additional-host-class"
        );
    });

    test("should remove the appended to body popup container on close", async () => {
        await popupAppendToBody.getPopupToggle.click();
        await popupAppendToBody.getPopupBoxDetached.isVisible();

        await popupAppendToBody.getPopupToggle.click();
        await popupAppendToBody.getPopupBoxDetached.isHidden();
    });

    test("should accept custom width", async () => {
        await popupCustomWidth.getPopupToggle.click();

        await expect(popupCustomWidth.getPopupBox).toHaveCSS("width", "200px");
    });
});
