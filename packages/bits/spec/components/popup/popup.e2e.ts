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
import { PopupAtom } from "./popup.atom";

describe("USERCONTROL Popup", () => {
    let popupSimple: PopupAtom;
    let popupCustomWidth: PopupAtom;
    let popupIsOpened: PopupAtom;
    let popupAppendToBody: PopupAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("popup/popup-test");
        popupSimple = Atom.find(PopupAtom, "nui-demo-popup-simple");
        popupCustomWidth = Atom.find(PopupAtom, "nui-demo-popup-custom-width");
        popupIsOpened = Atom.find(PopupAtom, "nui-demo-popup-isOpen-true");
        popupAppendToBody = Atom.find(
            PopupAtom,
            "nui-demo-popup-append-to-body"
        );
    });

    afterEach(async () => {
        await Helpers.clickOnEmptySpace();
    });

    it("should respect the isOpen @Input", async () => {
        expect(await popupIsOpened.isOpened()).toBe(true);
    });

    it("should be opened/closed on click event", async () => {
        await popupSimple.getPopupToggle().click();
        expect(await popupSimple.isOpened()).toBe(true);

        await popupSimple.getPopupToggle().click();
        expect(await popupSimple.isOpened()).toBe(false);
    });

    it("should be closed when other popup is opened", async () => {
        await popupSimple.getPopupToggle().click();
        await popupCustomWidth.getPopupToggle().click();

        expect(await popupSimple.isOpened()).toBe(false);
        expect(await popupCustomWidth.isOpened()).toBe(true);
    });

    it("should be closed if click outside the popup", async () => {
        await popupSimple.getPopupToggle().click();

        await Helpers.clickOnEmptySpace();
        expect(await popupSimple.isOpened()).toBe(false);
    });

    it("should attach container to body", async () => {
        await popupAppendToBody.getPopupToggle().click();
        expect(await popupAppendToBody.isOpenedAppendToBody()).toBe(true);
    });

    it("should detach container from body when closed", async () => {
        await popupAppendToBody.getPopupToggle().click();
        expect(await popupAppendToBody.isOpenedAppendToBody()).toBe(true);
        await Helpers.clickOnEmptySpace();
        expect(await popupAppendToBody.isOpenedAppendToBody()).toBe(false);
    });

    it("should respect context class", async () => {
        await popupAppendToBody.getPopupToggle().click();
        expect(
            await popupAppendToBody
                .getPopupBoxDetached()
                .getElement()
                .getAttribute("class")
        ).toMatch("additional-host-class");
    });

    it("should remove the appended to body popup container on close", async () => {
        await popupAppendToBody.getPopupToggle().click();
        expect(
            await popupAppendToBody.getPopupBoxDetached().isPresent()
        ).toBeTruthy();

        await popupAppendToBody.getPopupToggle().click();
        expect(
            await popupAppendToBody.getPopupBoxDetached().isPresent()
        ).toBeFalsy("Popup container is still in DOM!");
    });

    it("should accept custom width", async () => {
        await popupCustomWidth.getPopupToggle().click();

        expect(popupCustomWidth.getPopupBox().getCssValue("width")).toMatch(
            "200px"
        );
    });
});
