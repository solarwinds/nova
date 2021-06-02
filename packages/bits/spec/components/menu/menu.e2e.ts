import { browser, by, element, Key, protractor } from "protractor";

import { Atom } from "../../atom";
import { CheckboxAtom } from "../../components/checkbox/checkbox.atom";
import { Helpers } from "../../helpers";
import { MenuItemAtom } from "./menu-item.atom";
import { MenuAtom } from "./menu.atom";

describe("USERCONTROL Menu", () => {
    let menu: MenuAtom;
    let appendToBody: MenuAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("menu/menu-test");

        menu = Atom.find(MenuAtom, "nui-demo-e2e-menu-variants");
        appendToBody = Atom.find(MenuAtom, "nui-demo-e2e-menu-append-to-body");
        appendToBody.menuContentId = "nui-demo-e2e-menu-append-to-body-content";
    });

    describe("> menu group", () => {
        it("should not close when clicked on header or divider", async () => {
            await menu.toggleMenu();
            await menu.clickHeaderByIndex(0);
            await menu.clickDividerByIndex(0);
            expect(await menu.isMenuOpened()).toBe(true);
            await menu.toggleMenu();
        });
    });

    describe("> multi-selection menu", () => {
        afterEach(async () => {
            await menu.toggleMenu();
        });

        it("should select items", async () => {
            await menu.toggleMenu();
            const option1 = menu.getMenuItemByContainingText("Menu Item1");
            const option2 = menu.getMenuItemByContainingText("Menu Item2");
            await option1.clickItem();
            expect(await menu.getSelectedCheckboxesCount()).toEqual(1);
            await option2.clickItem();
            expect(await menu.getSelectedCheckboxesCount()).toEqual(2);
            await option2.clickItem();
            expect(await menu.getSelectedCheckboxesCount()).toEqual(1);
            // Return to initial state
            await option1.clickItem();
            expect(await menu.getSelectedCheckboxesCount()).toEqual(0);
        });
    });

    describe("> key navigation", () => {
        describe("> basic", () => {
            it("should open menu immediately if focused by TAB key", async () => {
                const menuContainer = menu.getElement().element(by.xpath("../.."));
                await menuContainer.click();
                await browser.actions().sendKeys(protractor.Key.TAB).perform();
                expect(await menu.isMenuOpened()).toBe(true);
            });

            it("should close menu when navigating from it by TAB key", async () => {
                const menuContainer = menu.getElement().element(by.xpath("../.."));
                await menuContainer.click();
                await browser.actions().sendKeys(protractor.Key.TAB).perform();
                expect(await menu.isMenuOpened()).toBe(true);
                await browser.actions().sendKeys(protractor.Key.TAB).perform();
                expect(await menu.isMenuOpened()).toBe(false);
            });

            it("should NOT open and close menu by ENTER key if focused on toggle", async () => {
                await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                expect(await menu.isMenuOpened()).toBe(false);
                await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                expect(await menu.isMenuOpened()).toBe(false);
            });

            it("should open and NOT close menu by Shift + DOWN-ARROW key if focused on toggle", async () => {
                await menu.toggleMenu();
                await browser.actions().sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.ARROW_DOWN)).perform();
                expect(await menu.isMenuOpened()).toBe(true);
                await browser.actions().sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.ARROW_DOWN)).perform();
                expect(await menu.isMenuOpened()).toBe(true);
            });

            it("should close menu on ESC key", async () => {
                await menu.toggleMenu();
                await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
                expect(await menu.isMenuOpened()).toBe(false);
            });

            // Enable tests in the scope of NUI-6104.
            xdescribe("arrow navigation and menu item types >", async() => {
                const moveDownKeyboardInputs = [
                    Key.PAGE_DOWN,
                    Key.END,
                    Key.chord(Key.META, Key.ARROW_DOWN),
                ];

                const moveUpKeyboardInputs = [
                    Key.PAGE_UP,
                    Key.HOME,
                    Key.chord(Key.META, Key.ARROW_UP),
                ];

                beforeEach(async () => {
                    await menu.toggleMenu();
                });

                it("should check and uncheck menu-switch using Enter", async () => {
                    await Helpers.pressKey(Key.ARROW_DOWN, 2);
                    expect(await menu.getSelectedSwitchesCount()).toEqual(1);

                    await Helpers.pressKey(Key.ENTER);
                    expect(await menu.getSelectedSwitchesCount()).toEqual(0);

                    await Helpers.pressKey(Key.ENTER);
                    await Helpers.pressKey(Key.ARROW_DOWN);
                    await Helpers.pressKey(Key.ENTER);
                    expect(await menu.getSelectedSwitchesCount()).toEqual(2);
                    // Return to initial state
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    await browser.actions().sendKeys(protractor.Key.ARROW_UP).perform();
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    expect(await menu.getSelectedSwitchesCount()).toEqual(0);
                });

                it("should select and close menu when selecting menu action item", async () => {
                    await Helpers.pressKey(Key.ENTER);
                    expect(await menu.isMenuOpened()).toBe(false);
                });

                it("should check and uncheck checkbox and properly handle disabled menu items", async () => {
                    await Helpers.pressKey(Key.ARROW_DOWN, 4);
                    await Helpers.pressKey(Key.ENTER);
                    expect(await menu.isMenuOpened()).toBe(true);
                    expect(await menu.getSelectedCheckboxesCount()).toBe(1);
                    await Helpers.pressKey(Key.ENTER);
                    expect(await menu.isMenuOpened()).toBe(true);
                    expect(await menu.getSelectedCheckboxesCount()).toBe(0);
                });

                it("should close menu when clicking TAB from active menu item", async () => {
                    await Helpers.pressKey(Key.ARROW_DOWN);
                    await Helpers.pressKey(Key.TAB);
                    expect(await menu.isMenuOpened()).toBe(false);
                });

                it("should jump to the last item on END, PAGE_DOWN, or Command + ARROW_DOWN key chords", async () => {
                    await assertStartAndEndKeyboardShortcuts(moveDownKeyboardInputs, menu, "last");
                });

                it("should jump to the last item on HOME, PAGE_UP, or Command + ARROW_UP key chords", async () => {
                    await assertStartAndEndKeyboardShortcuts(moveUpKeyboardInputs, menu, "first");
                });
            });
        });

        describe("> append-to-body", () => {
            it("should check and uncheck checkbox in menu item", async () => {
                await appendToBody.toggleMenu();
                await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                const checkbox = Atom.findIn(CheckboxAtom, appendToBody.getAppendToBodyMenu(), 0);
                expect(await checkbox.isChecked()).toBe(false);
                await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                expect(await checkbox.isChecked()).toBe(true);
                // Return to initial state
                await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                expect(await checkbox.isChecked()).toBe(false);
                await appendToBody.toggleMenu();
            });
        });
    });
});

async function assertStartAndEndKeyboardShortcuts(keys: Array<string>, menu: MenuAtom, position: "first" | "last") {
    for(const key of keys) {
        if (!(await menu.isMenuOpened())) {
            await menu.toggleMenu();
        }
        const currentItem =
            position === "first"
                ? new MenuItemAtom(MenuAtom.getAllMenuItems().first())
                : new MenuItemAtom(MenuAtom.getAllMenuItems().last());
        await Helpers.pressKey(position === "first" ? Key.END : Key.HOME);
        await Helpers.pressKey(key);

        expect(await currentItem.isActiveItem()).toBe(true, `assertion failed for key ${key}`);

        await menu.toggleMenu();
    }
}
