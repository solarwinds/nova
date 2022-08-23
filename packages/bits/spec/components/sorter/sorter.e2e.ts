import { Key } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom, IconAtom, SorterAtom } from "../public_api";

describe("USERCONTROL Sorter >", () => {
    let sorter: SorterAtom;
    let sorterButton: ButtonAtom;
    let icon: IconAtom | undefined;

    beforeAll(async () => {
        await Helpers.prepareBrowser("sorter");
        sorter = Atom.find(SorterAtom, "nui-demo-sorter");
        sorterButton = sorter.getSorterButton();
        icon = await sorterButton.getIcon();
    });

    beforeEach(async () => {
        if (await sorter.isPopupDisplayed()) {
            await sorter.click();
        }
        if ((await sorter.getCurrentValue()) !== "Year") {
            await sorter.select("Year");
        }
        if ((await icon?.getName()) === "arrow-down") {
            await sorterButton.click();
        }
    });

    describe("sorter >", () => {
        it("should contains expected items", async () => {
            await sorter.click();
            expect(await sorter.getNumberOfItems()).toBe(3);
            expect(await sorter.getItemText(0)).toBe("Title");
            expect(await sorter.getItemText(1)).toBe("Year");
            expect(await sorter.getItemText(2)).toBe("Director");
        });

        it("should change icon direction on click", async () => {
            await sorterButton.click();
            expect(await icon?.getName()).toBe("arrow-down");
        });

        it("should have correct text in caption", async () => {
            const caption = "Sorter Caption";
            expect(await sorter.getCaptionText()).toEqual(caption);
        });

        describe("when a value is picked from select, it", () => {
            const selectedColumn = "Title";
            beforeEach(async () => {
                await sorter.select(selectedColumn);
            });

            it("should display selected item on sorter button", async () => {
                expect(await sorter.getCurrentValue()).toEqual(selectedColumn);
            });

            // TODO: Enable in scope of NUI-4879
            it("should mark the selected item in the select menu", async () => {
                const items = sorter.getSelectedItems();
                await sorter.click();
                expect(await sorter.isPopupDisplayed()).toEqual(true);
                expect(await items.count()).toEqual(1);
                expect(await items.get(0).getText()).toEqual("Title");
            });
        });

        describe("key navigation >", () => {
            it("should close sorter menu when navigating from it by TAB key", async () => {
                await sorter.click();
                expect(await sorter.isPopupDisplayed()).toBe(true);
                await Helpers.pressKey(Key.TAB);
                expect(await sorter.isPopupDisplayed()).toBe(false);
            });
            // TODO Change this test in the scope of NUI-6132
            it("should close sorter menu by ESCAPE key, open by ENTER, and select first item", async () => {
                await sorter.click();
                expect(await sorter.isPopupDisplayed()).toBe(true);
                await Helpers.pressKey(Key.ESCAPE);
                expect(await sorter.isPopupDisplayed()).toBe(false);
                await Helpers.pressKey(Key.ENTER);
                await Helpers.pressKey(Key.ARROW_DOWN);
                await Helpers.pressKey(Key.ENTER);
                expect(await sorter.getCurrentValue()).toBe("Title");
            });
            // TODO Change this test in the scope of NUI-6132
            it("should select sort items by keyboard", async () => {
                await sorter.click();
                await Helpers.pressKey(Key.ARROW_DOWN, 3);
                await Helpers.pressKey(Key.ENTER);
                expect(await sorter.getCurrentValue()).toBe("Director");
                await Helpers.pressKey(Key.ENTER);
                await Helpers.pressKey(Key.ARROW_DOWN, 2);
                await Helpers.pressKey(Key.ARROW_UP);
                await Helpers.pressKey(Key.ENTER);
                expect(await sorter.getCurrentValue()).toBe("Title");
            });
        });
    });
});
