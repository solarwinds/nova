import {
    browser,
    by,
    ElementArrayFinder,
    protractor,
} from "protractor";

import { Atom } from "../../atom";
import { CheckboxAtom } from "../../components/checkbox/checkbox.atom";
import { SwitchAtom } from "../../components/switch/switch.atom";
import { Helpers } from "../../helpers";

import { MenuAtom } from "./menu.atom";

describe("USERCONTROL Menu", () => {
    let menu: MenuAtom;
    let appendToBody: MenuAtom;

    beforeAll(() => {
        menu = Atom.find(MenuAtom, "nui-demo-e2e-menu-variants");
        appendToBody = Atom.find(MenuAtom, "nui-demo-e2e-menu-append-to-body");
        appendToBody.menuContentId = "nui-demo-e2e-menu-append-to-body-content";
    });

    beforeEach(async () => {
        await Helpers.prepareBrowser("menu/menu-test");
    });

    afterEach(async () => {
        await menu.toggleMenu();
    });

    describe("> basic menu", () => {
        it("should show menu", async () => {
            expect(await menu.isMenuOpened()).toBe(false);
            await menu.toggleMenu();
            expect(await menu.isMenuOpened()).toBe(true);
        });

        it("should return menu titles", async () => {
            await menu.toggleMenu();
            expect(await menu.getItemTextArray())
                .toEqual([
                    "Menu Item",
                    "Selected menu item",
                    "Switched checked",
                    "Switch unchecked",
                    "Disabled switch",
                    "Disabled action",
                    "Disabled link",
                    "Disabled option",
                    "Menu item with checkbox",
                    "Menu item with icon",
                    "Link menu item",
                    "Export PDF",
                    "Menu Item1",
                    "Menu Item2",
                    "Menu Item3",
                ]);
        });

        it("should have enabled items by default", async () => {
            await menu.toggleMenu();
            expect(await menu.getMenuItemByContainingText("Export PDF").isDisabledItem()).toBe(false);
            expect(await menu.getMenuItemByContainingText("Switched checked").isDisabledItem()).toBe(false);
            expect(await menu.getMenuItemByContainingText("Menu item with checkbox").isDisabledItem()).toBe(false);
            expect(await menu.getMenuItemByContainingText("Link menu item").isDisabledItem()).toBe(false);
        });
    });

    describe("> disabled items", () => {
        beforeEach(async () => {
            await menu.toggleMenu();
        });
        it("should have disabled items", async () => {
            expect(await menu.getMenuItemByContainingText("Disabled switch").isDisabledItem()).toBe(true);
            expect(await menu.getMenuItemByContainingText("Disabled action").isDisabledItem()).toBe(true);
            expect(await menu.getMenuItemByContainingText("Disabled link").isDisabledItem()).toBe(true);
            expect(await menu.getMenuItemByContainingText("Disabled option").isDisabledItem()).toBe(true);
        });
        it("should locate disabled checkbox", async () => {
            const disabledOptionItem = menu.getMenuItemByContainingText("Disabled option");
            const checkbox: CheckboxAtom = Atom.findIn(CheckboxAtom, disabledOptionItem.getElement());
            expect(await checkbox.isChecked()).toBe(false);
        });
        it("should locate disabled switch", async () => {
            const disabledSwitchItem = menu.getMenuItemByContainingText("Disabled switch");
            const switchAtom = Atom.findIn(SwitchAtom, disabledSwitchItem.getElement());
            expect(await switchAtom.isOn()).toBe(false);
        });
    });

    describe("> menu button", () => {
        it("should have title", async () => {
            expect(await menu.getMenuButton().getText()).toEqual("Basic menu");
        });
        it("should have default icon in menu button", async () => {
            const iconName = await menu.getMenuButtonIconName();
            expect(iconName).toEqual("caret-down");
        });
    });

    describe("> menu group", () => {
        it("should have correct group titles", async () => {
            await menu.toggleMenu();
            expect(await menu.getHeaderTextArray()).toEqual(["SECTION TITLE", "SECTION 2 TITLE"]);
        });

        it("should not close when clicked on header or divider", async () => {
            await menu.toggleMenu();
            await menu.clickHeaderByIndex(0);
            await menu.clickDividerByIndex(0);
            expect(await menu.isMenuOpened()).toBe(true);
        });
    });

    describe("> multi-selection menu", () => {
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
        });
    });

    describe("> key navigation", () => {
        const checkElementsActiveState = async () => {
            await menu.toggleMenu();
            await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
            expect(await menu.getMenuItemByIndex(0).isActiveItem()).toBe(true);
            await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
            expect(await menu.getMenuItemByIndex(1).isActiveItem()).toBe(true);
            await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
            expect(await menu.getMenuItemByIndex(2).isActiveItem()).toBe(true);
        };

        describe("> basic", () => {
            it("should have proper active items", async () => {
                await checkElementsActiveState();
            });


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
                await menu.toggleMenu();
                await menu.toggleMenu();
                await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                expect(await menu.isMenuOpened()).toBe(false);
                await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                expect(await menu.isMenuOpened()).toBe(false);
            });

            it("should open and NOT close menu by Shift + DOWN-ARROW key if focused on toggle", async () => {
                await menu.toggleMenu();
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

            describe("arrow navigation and menu item types >", async() => {
                it("should check and uncheck menu-switch using Enter", async () => {
                    await menu.toggleMenu();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    expect(await menu.getSelectedSwitchesCount()).toEqual(1);
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    expect(await menu.getSelectedSwitchesCount()).toEqual(0);
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    expect(await menu.getSelectedSwitchesCount()).toEqual(2);
                });

                it("should select and close menu when selecting menu action item", async () => {
                    await menu.toggleMenu();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    expect(await menu.isMenuOpened()).toBe(false);
                });

                it("should check and uncheck checkbox and properly handle disabled menu items", async () => {
                    await menu.toggleMenu();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    expect(await menu.isMenuOpened()).toBe(true);
                    expect(await menu.getSelectedCheckboxesCount()).toBe(1);
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    expect(await menu.isMenuOpened()).toBe(true);
                    expect(await menu.getSelectedCheckboxesCount()).toBe(0);
                });

                it("should close menu when clicking TAB from active menu item", async () => {
                    await menu.toggleMenu();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.TAB).perform();
                    expect(await menu.isMenuOpened()).toBe(false);
                });

            });
        });

        describe("> append-to-body", () => {
            it("should have proper active items", async () => {
                await checkElementsActiveState();
            });

            it("should check and uncheck checkbox in menu item", async () => {
                await appendToBody.toggleMenu();
                await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                const checkbox = Atom.findIn(CheckboxAtom, appendToBody.getAppendToBodyMenu(), 0);
                expect(await checkbox.isChecked()).toBe(false);
                await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                expect(await checkbox.isChecked()).toBe(true);
            });

            describe("> with groups", () => {
                it("last menu group divider should be hidden", async () => {
                    await appendToBody.toggleMenu();
                    const menuDividers: ElementArrayFinder = appendToBody.getAppendToBodyMenuDividers();
                    expect(await menuDividers.last().isDisplayed()).toEqual(false);
                });
            });
        });
    });
});
