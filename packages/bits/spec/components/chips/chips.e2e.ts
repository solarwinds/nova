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

import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ChipsAtom } from "../public_api";

xdescribe("USERCONTROL chips", () => {
    const flatHorizontal = Atom.find(
        ChipsAtom,
        "nui-demo-chips-flat-horizontal"
    );
    const flatVertical = Atom.find(ChipsAtom, "nui-demo-chips-flat-vertical");
    const groupedHorizontal = Atom.find(
        ChipsAtom,
        "nui-demo-chips-grouped-horizontal"
    );
    const groupedVertical = Atom.find(
        ChipsAtom,
        "nui-demo-chips-grouped-vertical"
    );
    const autoHideChips = Atom.find(ChipsAtom, "nui-demo-chips-autohide");
    const overflowChips = Atom.find(ChipsAtom, "nui-demo-chips-overflow");
    const flatChickletNames = ["Down", "Critical", "Warning", "Unknown", "Ok"];

    beforeAll(async () => {
        await Helpers.prepareBrowser("chips/chips-test");
    });

    describe("initial appearance", () => {
        it("should have approptiate amount of filter groups on the page", async () => {
            expect(await flatHorizontal.getGroupsCount()).toEqual(0);
            expect(await flatVertical.getGroupsCount()).toEqual(0);
            expect(await groupedHorizontal.getGroupsCount()).toEqual(2);
            expect(await groupedVertical.getGroupsCount()).toEqual(2);
        });

        it("should have correct number of hidden chips", async () => {
            expect(await overflowChips.isVisible()).toEqual(true);
            browser.driver.manage().window().setSize(900, 890);
            expect(await overflowChips.getChipsOverflowCounter()).toEqual(
                "+11"
            );
        });

        it("should hide correct number of chips", async () => {
            expect(await overflowChips.isVisible()).toEqual(true);
            browser.driver.manage().window().setSize(900, 890);
            const allChips = overflowChips.getChipElements();
            const allChipsCount = await allChips.count();
            const visibleChipsCount = await allChips
                .filter(async (elem) => elem.isDisplayed())
                .count();
            const hiddenChips = allChipsCount - visibleChipsCount;
            expect(hiddenChips).toEqual(11);
        });
    });

    describe("behavior", async () => {
        async function checkRemoveItem(chips: ChipsAtom) {
            const chipsQuantity = await chips.getChipsQuantityFromLabel();
            await chips.removeItem(1);
            expect(await chips.getChipsCount()).toBe(chipsQuantity - 1);
        }

        async function checkVisibilityAfterClearAll(
            chips: ChipsAtom,
            expected: boolean
        ) {
            expect(await chips.isVisible()).toEqual(true);
            await chips.clearAll();
            expect(await chips.isVisible()).toEqual(expected);
        }

        beforeEach(async () => {
            await Helpers.prepareBrowser("chips/chips-test");
        });

        it("should remove item when clicking on it", async () => {
            await checkRemoveItem(flatVertical);
            await checkRemoveItem(groupedVertical);
        });

        it("should remove group when all group items are removed", async () => {
            for (let i = 0; i < flatChickletNames.length; i++) {
                await groupedHorizontal.removeItem(0);
            }
            expect(await groupedHorizontal.getGroupsCount()).toBe(1);

            for (let i = 0; i < flatChickletNames.length; i++) {
                await groupedVertical.removeItem(0);
            }
            expect(await groupedVertical.getGroupsCount()).toBe(1);
        });

        it("should disappear after removing all items when autoHide is true", async () => {
            expect(await flatHorizontal.isVisible()).toEqual(true);
            for (let i = 0; i < flatChickletNames.length; i++) {
                await flatHorizontal.removeItem(0);
            }
            expect(await flatHorizontal.isVisible()).toEqual(false);
        });

        it("should not disappear after removing all items when autoHide is false", async () => {
            expect(await autoHideChips.isVisible()).toEqual(true);
            for (let i = 0; i < flatChickletNames.length; i++) {
                await autoHideChips.removeItem(0);
            }
            expect(await autoHideChips.isVisible()).toEqual(true);
        });

        it("should disappear when 'clear all' link is used and when autoHide is true", async () => {
            await checkVisibilityAfterClearAll(flatVertical, false);
            await checkVisibilityAfterClearAll(groupedVertical, false);
        });

        it("should not disappear when 'clear all' link is used and when autoHide is false", async () => {
            await checkVisibilityAfterClearAll(autoHideChips, true);
        });

        it("should have correct number of hidden chips and groups in popover", async () => {
            await overflowChips.getChipsOverflowElement().click();
            const popup = Helpers.getElementByCSS(
                ".nui-popover-container__content"
            );
            browser.driver.manage().window().setSize(900, 890);
            expect(
                (await popup.findElements(by.className(ChipsAtom.itemClass)))
                    .length
            ).toEqual(11);
            expect(
                (
                    await popup.findElements(
                        by.className(ChipsAtom.groupNameClass)
                    )
                ).length
            ).toEqual(3);
        });

        it("should remove chip on remove icon click", async () => {
            browser.driver.manage().window().setSize(900, 890);
            await overflowChips.getChipsOverflowElement().click();
            const popup = Helpers.getElementByCSS(
                ".nui-popover-container__content"
            );
            await (
                await popup.findElement(by.className("nui-chip__value-remove"))
            ).click();
            expect(
                (await popup.findElements(by.className(ChipsAtom.itemClass)))
                    .length
            ).toEqual(10);
            await Helpers.clickOnEmptySpace();
            expect(await overflowChips.getChipsOverflowCounter()).toEqual(
                "+10"
            );
        });
    });
});
