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

import { test, expect, Helpers } from "../../setup";

import { MenuAtom } from "./menu.atom";
import { Atom } from "../../atom";

test.describe("USERCONTROL Menu", () => {
    let menu: MenuAtom;
    let appendToBody: MenuAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("menu/menu-test", page);
        menu = Atom.find<MenuAtom>(
            MenuAtom,
            "nui-demo-e2e-menu-variants",
            true
        ) as MenuAtom;
        appendToBody = Atom.find<MenuAtom>(
            MenuAtom,
            "nui-demo-e2e-menu-append-to-body",
            true
        ) as MenuAtom;
        appendToBody.menuContentId = "nui-demo-e2e-menu-append-to-body-content";
        await menu.toBeVisible();
    });

    test.describe("> menu group", () => {
        test("should not close when clicked on header or divider", async () => {
            await menu.toggleMenu();
            await menu.clickHeaderByIndex(0);
            await menu.clickDividerByIndex(0);
            await menu.isMenuOpened();
            await menu.toggleMenu();
        });
    });

    test.describe("> multi-selection menu", () => {
        test("should select items", async () => {
            await menu.toggleMenu();
            const option1 = menu.getMenuItemByContainingText("Menu Item1");
            await option1.getLocator().scrollIntoViewIfNeeded();
            await option1.toBeVisible();
            const option2 = menu.getMenuItemByContainingText("Menu Item2");
            await option1.clickItem();
            expect(await menu.getSelectedCheckboxesCount()).toBe(1);
            await option2.clickItem();
            expect(await menu.getSelectedCheckboxesCount()).toBe(2);
            await option2.clickItem();
            expect(await menu.getSelectedCheckboxesCount()).toBe(1);
            // Return to initial state
            await option1.clickItem();
            expect(await menu.getSelectedCheckboxesCount()).toBe(0);
        });
    });

    test.describe("accessibility", () => {
        test("should have correct aria attributes", async () => {
            const button = menu.getMenuButton().getLocator();
            await expect(button).toHaveAttribute("aria-haspopup", "true");
            await expect(button).toHaveAttribute("aria-expanded", "false");

            await menu.toggleMenu();
            await expect(button).toHaveAttribute("aria-expanded", "true");

            // Check aria-controls
            const ariaControlsId = await button.getAttribute("aria-controls");
            expect(ariaControlsId).toBeTruthy();

            // Verify the content exists
            const content = Helpers.page.locator(`#${ariaControlsId}`);
            await expect(content).toBeVisible();

            await menu.toggleMenu();
            await expect(button).toHaveAttribute("aria-expanded", "false");
        });
    });

    test.describe("> key navigation", () => {
        test.describe("> basic", () => {
            test("should open menu immediately if focused by TAB key", async () => {
                // Focus the menu button using TAB
                await Helpers.pressKey("Tab");
                await menu.isMenuOpened();
            });

            test("should close menu when navigating from it by TAB key", async () => {
                await Helpers.pressKey("Tab");
                await menu.isMenuOpened();
                await Helpers.pressKey("Tab");
                await menu.isMenuClosed();
            });

            test("should open and close menu by ENTER key if focused on toggle", async () => {
                const toggle = menu.getMenuButton().getLocator();

                // Focus on toggle
                await toggle.focus();
                await expect(toggle).toBeFocused();

                // Open
                await Helpers.page.keyboard.press("Enter");
                await menu.isMenuOpened();

                // Close
                await Helpers.page.keyboard.press("Enter");
                await menu.isMenuClosed();
            });

            test("should open and close menu by SPACE key if focused on toggle", async () => {
                const toggle = menu.getMenuButton().getLocator();

                // Focus on toggle
                await toggle.focus();
                await expect(toggle).toBeFocused();

                // Open
                await Helpers.page.keyboard.press("Space");
                await menu.isMenuOpened();

                // Close
                await Helpers.page.keyboard.press("Space");
                await menu.isMenuClosed();
            });

            test("should open and NOT close menu by Shift + DOWN-ARROW key if focused on toggle", async () => {
                await menu.toggleMenu();
                await Helpers.page.keyboard.down("Shift");
                await Helpers.pressKey("ArrowDown");
                await Helpers.page.keyboard.up("Shift");
                await menu.isMenuOpened();
            });

            test("should close menu on ESC key", async () => {
                await menu.toggleMenu();
                await Helpers.pressKey("Escape");
                await menu.isMenuClosed();
            });

            test.describe("arrow navigation and menu item types >", async () => {
                const moveDownKeyboardInputs = [
                    "PageDown",
                    "End",
                    "Meta+ArrowDown",
                ];

                const moveUpKeyboardInputs = ["PageUp", "Home", "Meta+ArrowUp"];

                test.beforeEach(async () => {
                    await menu.toggleMenu();
                });

                test("should check and uncheck menu-switch using Enter", async () => {
                    await Helpers.pressKey("ArrowDown", 3);
                    expect(await menu.getSelectedSwitchesCount()).toEqual(1);

                    await Helpers.pressKey("Enter");
                    await menu.isMenuOpened();
                    expect(await menu.getSelectedSwitchesCount()).toEqual(0);

                    await Helpers.pressKey("Enter");
                    await menu.isMenuOpened();
                    await Helpers.pressKey("ArrowDown");
                    await Helpers.pressKey("Enter");
                    expect(await menu.getSelectedSwitchesCount()).toEqual(2);
                    // Return to initial state
                    await Helpers.pressKey("Enter");
                    await Helpers.pressKey("ArrowUp");
                    await Helpers.pressKey("Enter");
                    expect(await menu.getSelectedSwitchesCount()).toEqual(0);
                });

                test("should select and close menu when selecting menu action item", async () => {
                    await Helpers.pressKey("ArrowDown");
                    await Helpers.pressKey("Enter");
                    await menu.isMenuClosed();
                });

                test("should check and uncheck checkbox and properly handle disabled menu items", async () => {
                    await Helpers.pressKey("ArrowDown", 5);
                    await Helpers.pressKey("Enter");
                    await menu.isMenuOpened();
                    expect(await menu.getSelectedCheckboxesCount()).toBe(1);
                    await Helpers.pressKey("Enter");
                    await menu.isMenuOpened();
                    expect(await menu.getSelectedCheckboxesCount()).toBe(0);
                });

                test("should close menu when clicking TAB from active menu item", async () => {
                    await Helpers.pressKey("ArrowDown");
                    await Helpers.pressKey("Tab");
                    await menu.isMenuClosed();
                });

                test("should jump to the last item on END, PAGE_DOWN, or Command + ARROW_DOWN key chords", async () => {
                    await assertStartAndEndKeyboardShortcuts(
                        moveDownKeyboardInputs,
                        menu,
                        "last"
                    );
                });

                test("should jump to the last item on HOME, PAGE_UP, or Command + ARROW_UP key chords", async () => {
                    await assertStartAndEndKeyboardShortcuts(
                        moveUpKeyboardInputs,
                        menu,
                        "first"
                    );
                });
            });
        });

        test.describe("> append-to-body", () => {
            test("should check and uncheck checkbox in menu item", async () => {
                await appendToBody.toggleMenu();
                // Find all checkboxes in the appendToBody menu
                const menuLocator = appendToBody.getAppendToBodyMenu();
                const checkboxes = menuLocator.locator("nui-checkbox");
                const firstCheckbox = checkboxes.first();

                // Check class for checked state
                await expect(firstCheckbox).not.toHaveClass(/nui-checkbox--checked/);

                await Helpers.pressKey("ArrowDown");
                await Helpers.pressKey("Enter");
                await expect(firstCheckbox).toHaveClass(/nui-checkbox--checked/);

                // Return to initial state
                await Helpers.pressKey("Enter");
                await expect(firstCheckbox).not.toHaveClass(/nui-checkbox--checked/);
            });
        });
    });
});

async function assertStartAndEndKeyboardShortcuts(
    keys: Array<string>,
    menu: MenuAtom,
    position: "first" | "last"
) {
    const toggle = menu.getMenuButton().getLocator();
    for (const key of keys) {
        if (await menu.getPopupBox().getLocator().isHidden()) {
            await menu.toggleMenu();
        }
        await menu.isMenuOpened();

        // Ensure focus is on the toggle button to capture keystrokes
        await toggle.focus();

        // Use instance method to get menu items
        const itemsLocator = menu.getAllMenuItems();
        const itemCount = await itemsLocator.count();
        const targetIndex = position === "first" ? 0 : itemCount - 1;
        const targetItem = menu.getMenuItemByIndex(targetIndex);

        // Move to start/end using key
        // We use toggle.press which is more reliable than body.press when focus is known
        const resetKey = position === "first" ? "End" : "Home";
        await toggle.press(resetKey);
        await toggle.press(key);

        // Check if the item is active
        // Use assertion that waits for condition instead of immediate check
        await expect(targetItem.getLocator()).toHaveClass(/nui-menu-item--active/);
    }
}
