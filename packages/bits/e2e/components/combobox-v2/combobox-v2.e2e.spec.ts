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

import { ComboboxV2Atom } from "./combobox-v2.atom";
import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";

test.describe("USERCONTROL Combobox v2 >", () => {
    let comboboxBasic: ComboboxV2Atom;
    let comboboxError: ComboboxV2Atom;
    let comboboxMulti: ComboboxV2Atom;
    let comboboxCustomControl: ComboboxV2Atom;
    let virtualCombobox: ComboboxV2Atom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("combobox-v2/test", page);

        comboboxBasic = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "basic");
        comboboxError = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "error");
        comboboxMulti = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "multi");
        comboboxCustomControl = Atom.find<ComboboxV2Atom>(
            ComboboxV2Atom,
            "custom-control"
        );
        virtualCombobox = Atom.find<ComboboxV2Atom>(
            ComboboxV2Atom,
            "virtual-combobox"
        );

        // Ensure we have a clean initial state per test
        await Helpers.page.reload();
    });

    test.describe("combobox V2 >", () => {
        test.describe("keyboard navigation", () => {
            test.beforeEach(async () => {
                await comboboxError.waitElementVisible();
                await Helpers.pressKey("Tab");
            });

            test.afterEach(async () => {
                await Helpers.page.locator(".focus-drop").click({ force: true });
            });

            test("should toggle", async () => {
                await comboboxError.toBeOpened();
            });

            test("should only one item be active", async () => {
                expect(await comboboxError.getActiveItemsCount()).toBe(1);
            });

            test("should navigate with UP and DOWN buttons", async () => {
                await Helpers.pressKey("ArrowDown", 5);
               
                await (await comboboxError.getOption(5)).toBeActive()

                await Helpers.pressKey("ArrowUp");
                await (await comboboxError.getOption(4)).toBeActive();
            });

            test("should close on focus out", async () => {
                await Helpers.pressKey("Shift+Tab");
                await comboboxError.toBeClosed();
            });

            test("should close on ESC button", async () => {
                await Helpers.pressKey("Escape");
                await comboboxError.toBeClosed();
            });

            test("should open on DOWN button", async () => {
                await Helpers.pressKey("Escape");
                await Helpers.pressKey("ArrowDown");
                await Helpers.pressKey("ArrowDown",5);
                await (await comboboxError.getOption(5)).toBeActive();
            });
            
            test("should select on ENTER", async () => {
                await Helpers.pressKey("ArrowDown", 4);
                await (await comboboxError.getOption(4)).toBeActive();
                await Helpers.pressKey("Enter");
                expect(await comboboxError.getInputValue()).toEqual("Item 4");
            });

            test("should reach the bottom of the list on PAGE_DOWN button pressed", async () => {
                const lastItemText = await (
                    await comboboxError.getLastOption()
                ).getText();
                await Helpers.pressKey("PageDown");
                await Helpers.pressKey("Enter");

                expect(await comboboxError.getInputValue()).toEqual(lastItemText);
            });

            test("should reach the top of the list on PAGE_UP button pressed", async () => {
                const firstItemText = await (
                    await comboboxError.getFirstOption()
                ).getText();
                await Helpers.pressKey("PageDown");
                await Helpers.pressKey("PageUp");
                await Helpers.pressKey("Enter");

                expect(await comboboxError.getInputValue()).toEqual(firstItemText);
            });

            test("should be able to navigate through the items if toggled using the toggle button", async () => {
                await Helpers.page.locator(".focus-drop").click({ force: true });
                await (await comboboxError.getFirstOption()).click();
                await comboboxError.toggleButton.click();
                await Helpers.pressKey("ArrowDown", 3);
                await Helpers.pressKey("ArrowUp");
                await expect(
                    await (await comboboxError.getOption(2)).getText()
                ).toEqual("Item 2");
            });

            test("shouldn't select a typed in option on press Tab key", async () => {
                await (await comboboxError.getFirstOption()).click();
                await comboboxError.toggleButton.click();
                await comboboxError.input.fill("Item 11");
                await Helpers.pressKey("Tab");

                expect(await comboboxError.getInputValue()).toEqual("Item 0");
            });

            test("should focus on the first item in dropdown when removing item on backspace", async () => {
                await comboboxError.click();
                const option = await comboboxError.getOption(5);
                await option.click();

                expect(await comboboxError.getInputValue()).toEqual("Item 5");
                await (await comboboxError.getOption(5)).toBeActive();

                await comboboxError.input.dblclick();
                await Helpers.pressKey("Backspace");

                expect(await comboboxError.getInputValue()).toEqual("");
                await (await comboboxError.getOption(0)).toBeActive();
            });
        });

        test.describe("basic actions", () => {
            test.beforeEach(async () => {
                await Helpers.page.reload();
            });

            test("should select input text if clicked on toggle button", async () => {
                await (await comboboxBasic.getFirstOption()).click();
                await comboboxBasic.toggleButton.click();
                expect(await comboboxBasic.getSelectionRange()).toBeGreaterThan(
                    0
                );
            });

            test("should drop selection on click", async () => {
                await comboboxBasic.click();
                expect(await comboboxBasic.getSelectionRange()).toEqual(0);
            });

            test("should scroll to active option on click", async () => {
                await comboboxBasic.click();

                const option = await comboboxBasic.getOption(50);

                await option.click();
                await comboboxBasic.click();

                const container = comboboxBasic.getPopupElement;

                const containerHeight = (await container.boundingBox())?.height;
                const containerTop = await container.evaluate((el) => (el as HTMLElement).scrollTop);
                const optionTop = await option
                    .getLocator()
                    .evaluate((el) => (el as HTMLElement).offsetTop);

                if (containerHeight == null) {
                    throw new Error("Unable to measure popup container height");
                }

                const isOptionVisibleInScrollBox =
                    optionTop > containerTop &&
                    optionTop < containerTop + containerHeight;

                expect(isOptionVisibleInScrollBox).toBeTruthy();
            });
        });

        test.describe("when popup follows the dimensions of its toggle reference", () => {
            const checkComboboxOverlayWidthEquality = async ()=>{
                await expect
                    .poll(async () => {
                        const comboboxWidth = (await comboboxCustomControl.getLocator().first().boundingBox())?.width;
                        const overlayWidth = (await comboboxCustomControl.getPopupElement.first().boundingBox())?.width;
                        if (comboboxWidth == null || overlayWidth == null) {
                            return false;
                        }
                        return Math.round(comboboxWidth) === Math.round(overlayWidth);
                    })
                    .toBe(true);
            }
            test("width should match", async () => {
                await Helpers.page.locator("#toggle").click();
                await checkComboboxOverlayWidthEquality();
                await comboboxCustomControl.selectFirst(18);
                await checkComboboxOverlayWidthEquality();
                await comboboxCustomControl.removeChips(10);
                await checkComboboxOverlayWidthEquality();
                await comboboxCustomControl.removeAll();
                await checkComboboxOverlayWidthEquality();
                await Helpers.page.locator("#hide").click();

            });
        });

        test.describe("selected items keyboard navigation", () => {
            test.beforeEach(async () => {
                // on small screen combobox input has small space to click
                await Helpers.page.setViewportSize({ width: 1900, height: 890 });

                const removeButtonMulti = comboboxMulti.removeAllButton;
                const removeButtonManual = comboboxCustomControl.removeAllButton;

                if ((await removeButtonMulti.count()) > 0) {
                    await removeButtonMulti.click();
                }
                if ((await removeButtonManual.count()) > 0) {
                    await removeButtonManual.click();
                }

                await Helpers.page.locator("#hide").click();
                await Helpers.page.locator(".focus-drop").click({ force: true });
            });

            test("should delete selected item on backspace", async () => {
                await comboboxMulti.selectAll();

                await expect(async () => await comboboxMulti.chips.count()).toPass();
                await expect(comboboxMulti.chips).toHaveCount(3);

                await comboboxMulti.toggleButton.click();

                await Helpers.pressKey("ArrowLeft");
                await Helpers.pressKey("Backspace", 2);

                await expect(comboboxMulti.chips).toHaveCount(1);
            });

            test("selected item should lose focus on not allowed keydown", async () => {
                await (await comboboxMulti.getLastOption()).click();

                await comboboxMulti.toggleButton.click();
                await Helpers.pressKey("ArrowLeft");

                await expect(comboboxMulti.activeChip).toHaveCount(1);

                await Helpers.pressKey("ArrowDown");

                await expect(comboboxMulti.activeChip).toHaveCount(0);
            });

            test("popup should be closed on selected items focus in", async () => {
                await (await comboboxMulti.getLastOption()).click();

                await comboboxMulti.toggleButton.click();
                await Helpers.pressKey("ArrowLeft");

                await comboboxMulti.toBeClosed();
            });

            test("popup should be opened on selected items focus out", async () => {
                await (await comboboxMulti.getLastOption()).click();

                await comboboxMulti.toggleButton.click();
                await Helpers.pressKey("ArrowLeft");
                await Helpers.pressKey("ArrowRight");

                await comboboxMulti.toBeOpened();
            });

            test("selected items shouldn't be looped", async () => {
                await comboboxMulti.selectAll();

                await comboboxMulti.toggleButton.click();
                await Helpers.pressKey("ArrowLeft", 7);

                await expect(comboboxMulti.chips.nth(0)).toHaveClass(/\bactive\b/);

                await Helpers.pressKey("ArrowRight");

                await expect(comboboxMulti.chips.nth(1)).toHaveClass(/\bactive\b/);
            });

            test("it should deactivate active option", async () => {
                await Helpers.page.locator("#show").click();
                await comboboxCustomControl.selectFirst(3);
                await comboboxCustomControl.toggleButton.click();
                await Helpers.pressKey("ArrowLeft");

                await expect(comboboxCustomControl.activeOption).toHaveCount(0);
                await expect(comboboxCustomControl.activeChip).toHaveCount(1);
            });

            test("should deactivate selected options", async () => {
                await Helpers.page.locator("#show").click();
                await comboboxCustomControl.selectFirst(3);
                await comboboxCustomControl.toggleButton.click();
                await Helpers.pressKey("ArrowLeft");
                await Helpers.pressKey("ArrowDown");

                await expect(comboboxCustomControl.activeChip).toHaveCount(0);
                await expect(comboboxCustomControl.activeOption).toHaveCount(1);
            });

            test("shouldn't close popup on popup focus out", async () => {
                await Helpers.page.locator("#show").click();
                await comboboxCustomControl.selectFirst(3);
                await comboboxCustomControl.toggleButton.click();
                await Helpers.pressKey("ArrowLeft");

                await expect(comboboxCustomControl.getPopupElement).toHaveCount(1);
            });

            test("should mark the first unfiltered item as active on open in multiselect", async () => {
                await comboboxMulti.click();
                await Helpers.pressKey("Enter");
                await Helpers.pressKey("ArrowDown");

                await (await comboboxMulti.getOption(1)).toBeActive();
            });
        });

        test.describe("> virtual scroll", () => {
            test("should always scroll to the first item in the list on filtering", async () => {
                await virtualCombobox.type("Item 2");

                await expect
                    .poll(async () =>
                        await (await virtualCombobox.getFirstOption()).getText()
                    )
                    .toBe("Item 2");
            });
        });
    });
});
