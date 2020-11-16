import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ChipsAtom } from "../public_api";

describe("USERCONTROL chips", () => {
    const flatHorizontal = Atom.find(ChipsAtom, "nui-demo-chips-flat-horizontal");
    const flatVertical = Atom.find(ChipsAtom, "nui-demo-chips-flat-vertical");
    const groupedHorizontal = Atom.find(ChipsAtom, "nui-demo-chips-grouped-horizontal");
    const groupedVertical = Atom.find(ChipsAtom, "nui-demo-chips-grouped-vertical");
    const autoHideChips = Atom.find(ChipsAtom, "nui-demo-chips-autohide");
    const overflowChips = Atom.find(ChipsAtom, "nui-demo-chips-overflow");
    const flatChickletNames = ["Down", "Critical", "Warning", "Unknown", "Ok"];
    const groupChickletNames = flatChickletNames.concat(["Cisco", "Hewlett Packard", "Uniper"]);

    describe("initial appearance", () => {
        beforeAll(async () => {
            await Helpers.prepareBrowser("chips");
        });

        it("should apply css class depending on 'vertical' prop", async () => {
            expect(await flatHorizontal.isVertical()).toEqual(false);
            expect(await flatVertical.isVertical()).toEqual(true);
            expect(await groupedHorizontal.isVertical()).toEqual(false);
            expect(await groupedVertical.isVertical()).toEqual(true);
        });

        it("should have approptiate amount of filter groups on the page", async () => {
            expect(await flatHorizontal.getGroupsCount()).toEqual(0);
            expect(await flatVertical.getGroupsCount()).toEqual(0);
            expect(await groupedHorizontal.getGroupsCount()).toEqual(2);
            expect(await groupedVertical.getGroupsCount()).toEqual(2);
        });

        it("should have correct group names", async () => {
            expect(await groupedHorizontal.getChipsGroupNames()).toEqual(["Status", "Vendor"]);
            expect(await groupedVertical.getChipsGroupNames()).toEqual(["Status", "Vendor"]);
        });

        it("should have correct chicklets names", async () => {
            expect(await flatHorizontal.getChipsNames()).toEqual(flatChickletNames);
            expect(await flatVertical.getChipsNames()).toEqual(flatChickletNames);
            expect(await groupedHorizontal.getChipsNames()).toEqual(groupChickletNames);
            expect(await groupedVertical.getChipsNames()).toEqual(groupChickletNames);
        });

        it("should have correct number of chips displayed", async () => {
            expect(await flatHorizontal.getChipsCount()).toEqual(flatChickletNames.length);
            expect(await flatVertical.getChipsCount()).toEqual(flatChickletNames.length);
            expect(await groupedHorizontal.getChipsCount()).toEqual(groupChickletNames.length);
            expect(await groupedVertical.getChipsCount()).toEqual(groupChickletNames.length);
        });

        it("should have correct number next to title", async () => {
            expect(await flatVertical.getChipsQuantityFromLabel()).toEqual(flatChickletNames.length);
            expect(await groupedVertical.getChipsQuantityFromLabel()).toEqual(groupChickletNames.length);
        });

        it("should have 'clear all' link when allowRemoveAll is true", async () => {
            expect(await flatHorizontal.getClearAllLinkElement().isPresent()).toEqual(true);
            expect(await flatVertical.getClearAllLinkElement().isPresent()).toEqual(true);
            expect(await groupedHorizontal.getClearAllLinkElement().isPresent()).toEqual(true);
            expect(await groupedVertical.getClearAllLinkElement().isPresent()).toEqual(true);
        });

        it("should have correct number of hidden chips", async () => {
            expect(await overflowChips.isVisible()).toEqual(true);
            browser.driver.manage().window().setSize(900, 890);
            expect(await overflowChips.getChipsOverflowCounter()).toEqual("+8");
        });
    });

    describe("behavior", async () => {
        async function checkRemoveItem(chips: ChipsAtom) {
            const chipsQuantity = await chips.getChipsQuantityFromLabel();
            await chips.removeItem(1);
            expect(await chips.getChipsCount()).toBe(chipsQuantity - 1);
        }

        async function checkVisibilityAfterClearAll(chips: ChipsAtom, expected: boolean) {
            expect(await chips.isVisible()).toEqual(true);
            await chips.clearAll();
            expect(await chips.isVisible()).toEqual(expected);
        }

        beforeEach(async () => {
            await Helpers.prepareBrowser("chips");
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
            const popup = Helpers.getElementByCSS(".nui-popover-container__content");
            expect((await popup.findElements(by.className(ChipsAtom.itemClass))).length).toEqual(8);
            expect((await popup.findElements(by.className(ChipsAtom.groupNameClass))).length).toEqual(2);
        });

        it("should remove chip on remove icon click", async () => {
            await overflowChips.getChipsOverflowElement().click();
            const popup = Helpers.getElementByCSS(".nui-popover-container__content");
            await (await popup.findElement(by.className("nui-chip__value-remove"))).click();
            expect((await popup.findElements(by.className(ChipsAtom.itemClass))).length).toEqual(7);
            await Helpers.clickOnEmptySpace();
            expect(await overflowChips.getChipsOverflowCounter()).toEqual("+7");
        });
    });
});
