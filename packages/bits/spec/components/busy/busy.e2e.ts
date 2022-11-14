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

import { browser, by, element, Key } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { BusyAtom, ButtonAtom, SelectAtom } from "../public_api";

describe("USERCONTROL Busy", () => {
    let busy: BusyAtom;
    let busyBtn: ButtonAtom;
    let select: SelectAtom;

    const busyById = (id: string) => Atom.findIn(BusyAtom, element(by.id(id)));

    beforeAll(async () => {
        busyBtn = Atom.find(ButtonAtom, "nui-busy-test-button");
        busy = busyById("nui-busy-test-basic");
        select = Atom.findIn(
            SelectAtom,
            element(by.id("nui-busy-select-overlay"))
        );
    });

    beforeEach(async () => {
        await Helpers.prepareBrowser("busy/busy-test");
    });

    it("should append container to the attached element", async () => {
        expect(await busy.isAppended()).toBe(true);
    });

    it("should not container be visible when inactive", async () => {
        expect(await busy.isDisplayed()).toBe(false);
    });

    describe("Busy overlaps and tab navigation", () => {
        beforeEach(async () => {
            await busyBtn.click();
        });

        afterEach(async () => {
            await busyBtn.click();
        });

        it("in default mode shows spinner", async () => {
            const spinner = busy.getSpinner();
            await spinner.waitForDisplayed();
            expect(await busy.getSpinner().isDisplayed()).toBe(true);
        });

        it("in progress mode shows progress bar", async () => {
            const progress = busyById("nui-busy-test-progress").getProgress();
            expect(await Atom.wait(async () => progress.isDisplayed())).toBe(
                true
            );
        });

        it("any appended to body popup (select) should not be overlapped by busy", async () => {
            await select.toggleMenu();
            // since select is appended to body, this is the simplest way to get its content
            const selectedItem = browser.element(
                by.cssContainingText(
                    ".nui-select-popup-host .nui-menu-item",
                    "Item 2"
                )
            );
            await selectedItem.click();
            expect(await select.getCurrentValue()).toBe("Item 2");
        });

        it("should NOT allow tab navigation when component is busy", async () => {
            await select.getElement().click();

            // should be focus on something else other than the last button on page
            await expect(await busyBtn.getElement().getId()).not.toEqual(
                await browser.switchTo().activeElement().getId()
            );

            await browser.actions().sendKeys(Key.TAB).perform();

            // should be focus on that the last button on page,
            // since the focusable elements were skipped during our tab navigation
            expect(await browser.switchTo().activeElement().getId()).toEqual(
                await busyBtn.getElement().getId()
            );
        });

        it("should allow tab navigation when component is NOT busy", async () => {
            // we'll be allowed to use tab navigation after busy=false
            await busyBtn.click();

            await select.getElement().click();
            await browser.actions().sendKeys(Key.TAB).perform();

            expect(
                await browser.switchTo().activeElement().getAttribute("id")
            ).toEqual("focusable-button-inside-busy-component");
        });
    });
});
