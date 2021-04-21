import {browser, by, protractor} from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { SelectAtom } from "./select.atom";

/**
 * Consider using this as a reference to the test cases to add to the select-v2 test suite in scope of NUI-4921
 */
xdescribe("USERCONTROL Select >", () => {
    let selectBasic: SelectAtom;
    let selectDisabled: SelectAtom;
    let inlineSelect: SelectAtom;
    let selectRequired: SelectAtom;
    let selectWithTemplate: SelectAtom;
    let selectWithReactiveForms: SelectAtom;
    let selectWithRemoveValue: SelectAtom;

    beforeAll(() => {
        selectBasic = Atom.find(SelectAtom, "nui-demo-basic-select");
        selectDisabled = Atom.find(SelectAtom, "nui-demo-basic-select-disabled");
        inlineSelect = Atom.find(SelectAtom, "nui-demo-inline-select");
        selectRequired = Atom.find(SelectAtom, "nui-demo-basic-select-required");
        selectWithTemplate = Atom.find(SelectAtom, "nui-demo-select-with-template");
        selectWithReactiveForms = Atom.find(SelectAtom, "nui-demo-basic-select-reactive-form");
        selectWithRemoveValue = Atom.find(SelectAtom, "nui-demo-select-remove-value");
    });

    beforeEach(async () => {
        await Helpers.prepareBrowser("select");
    });

    describe("select >", () => {
        describe("basic >", () => {
            it("should display placeholder", async () => {
                const placeholder = "Select item";
                expect(await selectBasic.getCurrentValue()).toEqual(placeholder);
            });

            it("contains expected items", async () => {
                await selectBasic.toggleMenu();
                expect(await selectBasic.getItemsCount()).toEqual(20);
                expect(await selectBasic.getItemText(0)).toEqual("Item 1");
                expect(await selectBasic.getItemText(19)).toEqual("Item 20");
            });

            describe("when a value is picked from select, it", () => {
                it("should display selected item on select button", async () => {
                    const target = "Item 2";
                    await selectBasic.select(target);
                    expect(await selectBasic.getCurrentValue()).toEqual(target);
                });

               it("should mark the selected item in the select menu", async () => {
                    const target = "Item 2";
                    await selectBasic.select(target);
                    await selectBasic.toggleMenu();
                    const selectedItem = selectBasic.getSelectedItem();
                    expect(await selectedItem.getAttribute("innerText")).toEqual(target);
                });
            });

            describe("selecting items with keyboard navigation >", () => {
                it("should correctly select items UP and DOWN arrows", async () => {
                    await selectBasic.toggleMenu();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    expect(await selectBasic.getCurrentValue()).toEqual("Item 1");
                    await selectBasic.toggleMenu();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ARROW_UP).perform();
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    expect(await selectBasic.getCurrentValue()).toEqual("Item 2");
                });

               it("should correctly select items with PAGE UP and PAGE DOWN keys", async () => {
                    await selectBasic.toggleMenu();
                    await browser.actions().sendKeys(protractor.Key.PAGE_DOWN).perform();
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    expect(await selectBasic.getCurrentValue()).toEqual("Item 20");
                    await selectBasic.toggleMenu();
                    await browser.actions().sendKeys(protractor.Key.PAGE_UP).perform();
                    await browser.actions().sendKeys(protractor.Key.ENTER).perform();
                    expect(await selectBasic.getCurrentValue()).toEqual("Item 1");
                });
            });
        });

        describe("disabled >", () => {
            it("should have disabled styling",  async () => {
                expect(await selectDisabled.isSelectDisabled()).toEqual(true);
            });

            it("should not show popup when disabled",  async () => {
                await selectDisabled.toggleMenu();
                expect(await selectDisabled.getMenu().isMenuOpened()).toBe(false);
                // shouldn't open by keyboard
                await browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
                expect(await selectDisabled.getMenu().isMenuOpened()).toBe(false);
            });
        });

        describe("custom template >", () => {
            it("applies the correct template", async () => {
                await selectWithTemplate.toggleMenu();
                expect(await selectWithTemplate.getItemsWithNestedClass().count()).toEqual(5);
            });
        });

        describe("required >", () => {
            it("should display selection-required hints when is-required is true", async () => {
                expect(await selectRequired.isRequiredStyleDisplayed()).toBe(true);
            });

            it("should not display selection-required hints if item is selected", async () => {
                // pristine
                expect(await selectRequired.isRequiredStyleDisplayed()).toBe(true);
                // focus and select
                await selectRequired.select("Element 5");
                expect(await selectRequired.isRequiredStyleDisplayed()).toEqual(false);
                // blur after select
                await selectBasic.toggleMenu();
                expect(await selectRequired.isRequiredStyleDisplayed()).toEqual(false);
                // focus again
                await selectRequired.toggleMenu();
                expect(await selectRequired.isRequiredStyleDisplayed()).toEqual(false);
                // blur again
                await selectBasic.toggleMenu();
                expect(await selectRequired.isRequiredStyleDisplayed()).toEqual(false);
            });
        });

        describe("inline >", () => {
            it("should have proper styles", async () => {
                const selectContainerDisplayStyle = await inlineSelect.getLayoutBlock().getCssValue("display");
                expect(selectContainerDisplayStyle).toEqual("inline-flex");
            });
        });

        describe("Reactive form >", () => {
            it("should have has error class when form is submitted and control is invalid", async () => {
                const submitButton = browser.element(by.css(`button[type = 'submit']`));
                expect(await selectWithReactiveForms.isRequiredStyleDisplayed()).toBe(false);
                await submitButton.click();
                expect(await selectWithReactiveForms.isRequiredStyleDisplayed()).toBe(true);
            });

            it("should not have error class when form is submitted and control is valid", async () => {
                expect(await selectWithReactiveForms.isRequiredStyleDisplayed()).toBe(false);
                const submitButton = browser.element(by.css(`button[type = 'submit']`));
                await submitButton.click();
                expect(await selectWithReactiveForms.isRequiredStyleDisplayed()).toBe(true);
                await selectWithReactiveForms.select("Item 1");
                await submitButton.click();
                expect(await selectWithReactiveForms.isRequiredStyleDisplayed()).toBe(false);
            });
        });

        describe("with remove value >", () => {
            it("should add 'None' item in dropdown in case 'isRemoveValueEnabled' input set to 'true'", async () => {
                await selectWithRemoveValue.toggleMenu();
                expect(await selectWithRemoveValue.getItemText(0)).toEqual("None");
            });

            it("should NOT add 'None' item in dropdown in case 'isRemoveValueEnabled' input set to 'true'", async () => {
                await selectBasic.toggleMenu();
                expect(await selectBasic.getItemText(0)).not.toEqual("None");
            });

            it("should remove select value on removeValue item click", async () => {
                const target = "None";
                await selectWithRemoveValue.select(target);
                expect(await selectWithRemoveValue.getCurrentValue()).toEqual("Please select...");
            });
        });
    });
});
