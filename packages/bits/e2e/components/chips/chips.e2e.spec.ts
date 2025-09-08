import { ChipsAtom } from "./chips.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";

test.describe("USERCONTROL chips", () => {
    let flatHorizontal: ChipsAtom;
    let flatVertical: ChipsAtom;
    let groupedHorizontal: ChipsAtom;
    let groupedVertical: ChipsAtom;
    let autoHideChips: ChipsAtom;
    let overflowChips: ChipsAtom;
    let flatChickletNames;

    test.beforeEach(async ({ page }): Promise<void> => {
        await Helpers.prepareBrowser("chips/chips-test", page);

        flatHorizontal = Atom.find<ChipsAtom>(
            ChipsAtom,
            "nui-demo-chips-flat-horizontal"
        );
        flatVertical = Atom.find<ChipsAtom>(
            ChipsAtom,
            "nui-demo-chips-flat-vertical"
        );
        groupedHorizontal = Atom.find<ChipsAtom>(
            ChipsAtom,
            "nui-demo-chips-grouped-horizontal"
        );
        groupedVertical = Atom.find<ChipsAtom>(
            ChipsAtom,
            "nui-demo-chips-grouped-vertical"
        );
        autoHideChips = Atom.find<ChipsAtom>(
            ChipsAtom,
            "nui-demo-chips-autohide"
        );
        overflowChips = Atom.find<ChipsAtom>(
            ChipsAtom,
            "nui-demo-chips-overflow"
        );
        flatChickletNames = ["Down", "Critical", "Warning", "Unknown", "Ok"];
    });

    test.describe("initial appearance", () => {
        test("should have approptiate amount of filter groups on the page", async () => {
            await expect(flatHorizontal.groups).toHaveCount(0);
            await expect(flatVertical.groups).toHaveCount(0);
            await expect(groupedHorizontal.groups).toHaveCount(2);
            await expect(groupedVertical.groups).toHaveCount(2);
        });

        test("should have correct number of hidden chips", async ({ page }) => {
            await overflowChips.toBeVisible();
            // on Circle ci it renders as +3
            // await expect(overflowChips.getChipsOverflow).toHaveText("+2");
            await page.setViewportSize({
                width: 900,
                height: 890,
            });
            await expect(overflowChips.getChipsOverflow).toHaveText("+11");
        });

        test("should hide correct number of chips", async ({ page }) => {
            await overflowChips.toBeVisible();
            // on Circle ci it renders as +3
            // await expect(overflowChips.getChipsOverflow).toHaveText("+2");
            await page.setViewportSize({
                width: 900,
                height: 890,
            });
            await expect(overflowChips.getChipElements).toHaveCount(25);
            await expect(
                overflowChips.getChipElements.filter({ visible: true })
            ).toHaveCount(14);
        });
    });

    test.describe("behavior", async () => {
        async function checkRemoveItem(chips: ChipsAtom) {
            const chipsQuantity = await chips.getChipsQuantityFromLabel();

            await chips.removeItem(1);

            await expect(chips.getChipElements).toHaveCount(chipsQuantity - 1);
        }

        async function checkVisibilityAfterClearAll(
            chips: ChipsAtom,
            expected: boolean
        ) {
            await chips.toBeVisible();

            await chips.clearAll();

            if (expected) {
                await chips.toBeVisible();
            } else {
                await chips.toBeHidden();
            }
        }

        test("should remove item when clicking on it", async () => {
            await checkRemoveItem(flatVertical);
            await checkRemoveItem(groupedVertical);
        });

        test("should remove group when all group items are removed", async () => {
            await expect(groupedHorizontal.groups).toHaveCount(2);
            for (let i = 0; i < flatChickletNames.length; i++) {
                await groupedHorizontal.removeItem(0);
            }

            await expect(groupedHorizontal.groups).toHaveCount(1);

            await expect(groupedVertical.groups).toHaveCount(2);
            for (let i = 0; i < flatChickletNames.length; i++) {
                await groupedVertical.removeItem(0);
            }
            await expect(groupedVertical.groups).toHaveCount(1);
        });

        test("should disappear after removing all items when autoHide is true", async () => {
            await flatHorizontal.toBeVisible();
            for (let i = 0; i < flatChickletNames.length; i++) {
                await flatHorizontal.removeItem(0);
            }
            await flatHorizontal.toBeHidden();
        });

        test("should not disappear after removing all items when autoHide is false", async () => {
            await autoHideChips.toBeVisible();
            for (let i = 0; i < flatChickletNames.length; i++) {
                await autoHideChips.removeItem(0);
            }
            await autoHideChips.toBeVisible();
        });

        test("should disappear when 'clear all' link is used and when autoHide is true", async () => {
            await checkVisibilityAfterClearAll(flatVertical, false);
            await checkVisibilityAfterClearAll(groupedVertical, false);
        });

        test("should not disappear when 'clear all' link is used and when autoHide is false", async () => {
            await checkVisibilityAfterClearAll(autoHideChips, true);
        });

        test("should have correct number of hidden chips and groups in popover", async ({
            page,
        }) => {
            await overflowChips.getChipsOverflow.click();
            await page.setViewportSize({
                width: 900,
                height: 890,
            });
            // inside pop up
            await expect(
                overflowChips.popup.locator(
                    Helpers.page.locator(`.${ChipsAtom.itemClass}`)
                )
            ).toHaveCount(11);
            await expect(
                overflowChips.popup.locator(
                    Helpers.page.locator(`.${ChipsAtom.groupNameClass}`)
                )
            ).toHaveCount(3);
        });

        test("should remove chip on remove icon click", async ({ page }) => {
            await page.setViewportSize({
                width: 900,
                height: 890,
            });
            await overflowChips.getChipsOverflow.click();
            await overflowChips.popup
                .locator(Helpers.page.locator(`.nui-chip__value-remove`))
                .nth(0)
                .click();
            await expect(
                overflowChips.popup.locator(
                    Helpers.page.locator(`.${ChipsAtom.itemClass}`)
                )
            ).toHaveCount(10);
            await Helpers.clickOnEmptySpace();
            await expect(overflowChips.getChipsOverflow).toHaveText("+10");
        });
    });
});
