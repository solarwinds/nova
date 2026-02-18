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

import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";
import { ComboboxAtom } from "./combobox.atom";
import { TextboxNumberAtom } from "../textbox-number/textbox-number.atom";

/**
 * Consider using this as a reference to the test cases to add to the combobox-v2 test suite in scope of NUI-4902
 */
test.describe("USERCONTROL Combobox >", () => {
    let comboboxBasic: ComboboxAtom;
    let comboboxDisabled: ComboboxAtom;
    let inlineCombobox: ComboboxAtom;
    let reactiveFormCombobox: ComboboxAtom;
    let comboboxJustified: ComboboxAtom;
    let comboboxRequired: ComboboxAtom;
    let comboClearOnBlur: ComboboxAtom;
    let comboboxWithIcon: ComboboxAtom;
    let comboboxWithDisplayValue: ComboboxAtom;
    let comboboxTypeahead: ComboboxAtom;
    let comboboxSeparators: ComboboxAtom;
    let comboboxHTMLItems: ComboboxAtom;
    let comboboxWithTemplate: ComboboxAtom;
    let comboboxAppendToBody: ComboboxAtom;
    let comboboxRemoveValueButton: ComboboxAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("combobox/combobox-test", page);

        comboboxBasic = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-basic-combobox",
            true
        );
        comboboxDisabled = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-combobox-disabled",
            true
        );
        inlineCombobox = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-inline-combobox",
            true
        );
        comboboxJustified = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-justified-combobox",
            true
        );
        comboboxRequired = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-combobox-required",
            true
        );
        comboClearOnBlur = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-combobox-with-clear-on-blur",
            true
        );
        comboboxWithIcon = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-combobox-with-icon",
            true
        );
        reactiveFormCombobox = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-combobox-reactive-form",
            true
        );
        comboboxWithDisplayValue = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-display-value-combobox",
            true
        );
        comboboxTypeahead = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-combobox-typeahead",
            true
        );
        comboboxSeparators = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-combobox-separators",
            true
        );
        comboboxHTMLItems = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-combobox-html-in-items",
            true
        );
        comboboxWithTemplate = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-combobox-with-template",
            true
        );
        comboboxAppendToBody = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-combobox-append-to-body",
            true
        );
        comboboxRemoveValueButton = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-demo-combobox-remove-value-button",
            true
        );
    });

    test.describe("combobox >", () => {
        test.describe("basic >", () => {
            test("should display placeholder", async () => {
                const placeholder = "Select item";
                expect(await comboboxBasic.getComboboxPlaceholder()).toEqual(
                    placeholder
                );
            });

            test("contains expected items", async () => {
                await comboboxBasic.toggleMenu();
                expect(await comboboxBasic.getItemsCount()).toEqual(15);
                expect(await comboboxBasic.getItemText(0)).toEqual("Item 1");
                expect(await comboboxBasic.getItemText(4)).toEqual("Item 5");
            });

            test("should display empty string by default", async () => {
                expect(await comboboxBasic.getInputValue()).toEqual("");
            });

            test("should change the model after changing the text input", async () => {
                const inputText = "Some text";
                await comboboxBasic.acceptText(inputText);
                expect(await comboboxBasic.getInputValue()).toEqual(inputText);
            });

            test.describe("when a value is picked from combobox, it", () => {
                test("should display selected item, change input value and model after clicking on dropdown item", async () => {
                    const target = /^Item 1$/;
                    await comboboxBasic.select(target);
                    expect(await comboboxBasic.getInputValue()).toEqual("Item 1");
                });

                test("should mark the selected item in the combobox menu", async () => {
                    const target = /^Item 2$/;
                    await comboboxBasic.select(target);
                    await comboboxBasic.toggleMenu();
                    const selectedItem = comboboxBasic.getSelectedItem();
                    expect((await selectedItem.innerText()).trim()).toEqual(
                        "Item 2"
                    );
                });
            });

            test.describe("on blur event", () => {
                test("should save new value on blur event if input value has changed", async () => {
                    const oldValue = "Item 1";
                    const newValue = "Item 2";
                    await comboboxBasic.select(oldValue);
                    await comboboxBasic.toggleMenu();
                    await comboboxBasic.clearText();
                    await comboboxBasic.acceptInput(newValue);
                    const selectedItem = comboboxBasic.getSelectedItem();
                    expect((await selectedItem.innerText()).trim()).toEqual(
                        newValue
                    );
                });
            });
        });

        test.describe("disabled >", () => {
            test("should have disabled styling", async () => {
                await expect(comboboxDisabled.getInput()).toBeDisabled();
            });
        });

        test.describe("clear on blur >", () => {
            test("should clear input on blur if it's value is not in source array", async () => {
                await comboClearOnBlur.acceptInput("Not in a source array");
                await comboboxBasic.toggleMenu();
                await expect(comboClearOnBlur.getSelectedItems()).toHaveCount(0);
            });

            test("should keep input value in input on blur if it's value is in source array", async () => {
                await comboClearOnBlur.acceptInput("Item 1");
                await comboboxBasic.toggleMenu();
                expect(await comboClearOnBlur.getInputValue()).toEqual("Item 1");
            });
        });

        test.describe("justified >", () => {
            let widthInput: TextboxNumberAtom;
            let component: Locator;
            let parent: Locator;

            test.beforeEach(() => {
                widthInput = Atom.find<TextboxNumberAtom>(
                    TextboxNumberAtom,
                    "nui-test-width-input"
                );
                component = comboboxJustified.getElementByClass(
                    "nui-combobox__layout-block"
                );
                parent = Helpers.page.locator(
                    "#nui-demo-justified-combobox-container"
                );
            });

            test("should respect width bigger than default", async () => {
                await compareWidths(500);
            });

            test("should respect width smaller than default", async () => {
                await widthInput.clearText();
                await widthInput.acceptText("60");
                await compareWidths(60);
            });

            async function compareWidths(expectedValue: number) {
                const componentWidth = (await component.boundingBox())?.width;
                const containerOuterWidth = (await parent.boundingBox())?.width;
                const containerLeftPadding = parseFloat(
                    (await parent.evaluate((el) => getComputedStyle(el).paddingLeft)) as string
                );
                const containerRightPadding = parseFloat(
                    (await parent.evaluate((el) => getComputedStyle(el).paddingRight)) as string
                );
                if (componentWidth == null || containerOuterWidth == null) {
                    throw new Error("Unable to measure element widths");
                }
                const containerWidth =
                    containerOuterWidth -
                    containerLeftPadding -
                    containerRightPadding;

                expect(componentWidth).toEqual(containerWidth);
                expect(Math.round(componentWidth)).toEqual(expectedValue);
            }
        });

        test.describe("required >", () => {
            test("should display selection-required hints when focused when is-required is true", async () => {
                expect(await comboboxRequired.isRequiredStyleDisplayed()).toEqual(true);
                await comboboxRequired.toggleMenu();
                expect(await comboboxRequired.isRequiredStyleDisplayed()).toEqual(true);
            });

            test("should not indicate error state if item is selected", async () => {
                expect(await comboboxRequired.isRequiredStyleDisplayed()).toEqual(true);
                await comboboxRequired.select("Item 5");
                expect(await comboboxRequired.isRequiredStyleDisplayed()).toEqual(false);
                await comboboxBasic.toggleMenu();
                expect(await comboboxRequired.isRequiredStyleDisplayed()).toEqual(false);
                await comboboxRequired.toggleMenu();
                expect(await comboboxRequired.isRequiredStyleDisplayed()).toEqual(false);
                await comboboxBasic.toggleMenu();
                expect(await comboboxRequired.isRequiredStyleDisplayed()).toEqual(false);
            });
        });

        test.describe("inline >", () => {
            test("should have proper styles", async () => {
                const display = await inlineCombobox
                    .getLayoutBlock()
                    .evaluate((el) => getComputedStyle(el).display);
                expect(display).toEqual("inline-flex");
            });
        });

        test.describe("icon adjustment >", () => {
            test("should contain icon with type 'add'", async () => {
                expect(await comboboxWithIcon.getIconName()).toEqual("add");
            });
        });

        test.describe("display value >", () => {
            test("should show correct values in input and dropdown", async () => {
                await comboboxWithDisplayValue.select("Item 1");
                expect(await comboboxWithDisplayValue.getInputValue()).toEqual(
                    "Item 1"
                );
            });
        });

        test.describe("reactive form >", () => {
            test("should not have error class when form is submitted and control is valid", async () => {
                const submitButton = Helpers.page.locator("button[type='submit']");
                await submitButton.click();
                expect(await reactiveFormCombobox.isRequiredStyleDisplayed()).toBe(false);
            });

            test("should set value both in textbox and menu when item is set from reactive form", async () => {
                const submitButton = Helpers.page.locator("button[type='submit']");
                await submitButton.click();
                await reactiveFormCombobox.toggleMenu();
                expect(await reactiveFormCombobox.getInputValue()).toEqual("Item 2");
                await expect(reactiveFormCombobox.getSelectedItems()).toHaveCount(1);
            });

            test("should have error class when form is submitted and control is not valid", async () => {
                const submitButton = Helpers.page.locator("button[type='submit']");
                await submitButton.click();
                await reactiveFormCombobox.textbox.deleteTextManually();
                await submitButton.click();
                expect(await reactiveFormCombobox.isRequiredStyleDisplayed()).toBe(true);
            });
        });

        test.describe("typeahead >", () => {
            test("should re-render dropdown for combobox with groups", async () => {
                await comboboxSeparators.waitElementVisible();
                await comboboxSeparators.toggleMenu();
                expect(await comboboxSeparators.getItemsCount()).toEqual(9);
                await comboboxSeparators.acceptText("Item 1");
                expect(await comboboxSeparators.getItemsCount()).toEqual(3);
            });
        });

        test.describe("highlight >", () => {
            test("should highlight appropriate items in dropdown for combobox with a plain list of items", async () => {
                await comboboxBasic.waitElementVisible();
                await comboboxBasic.toggleMenu();
                await comboboxBasic.acceptInput("Item");
                expect(await comboboxBasic.getHighlightedItemsCount()).toEqual(15);
                await comboboxBasic.clearText();
                await comboboxBasic.acceptInput("Item 1");
                expect(await comboboxBasic.getHighlightedItemsCount()).toEqual(6);
            });

            test("should highlight appropriate items in dropdown for combobox with groups", async () => {
                await comboboxSeparators.waitElementVisible();
                await comboboxSeparators.toggleMenu();
                await comboboxSeparators.acceptInput("Item");
                expect(await comboboxSeparators.getHighlightedItemsCount()).toEqual(9);
                await comboboxSeparators.clearText();
                await comboboxSeparators.acceptInput("Item 1");
                expect(await comboboxSeparators.getHighlightedItemsCount()).toEqual(3);
            });
        });

        test.describe("typeahead, displayValue, clearOnBlur >", () => {
            test("should not clear value after it's selected after dropdown", async () => {
                await comboboxTypeahead.waitElementVisible();
                await comboboxTypeahead.select("Item 111", true);
                await comboboxTypeahead.toggleMenu();
                expect(await comboboxTypeahead.getItemsCount()).toEqual(2);
                expect(await comboboxTypeahead.getInputValue()).toEqual("Item 111");
            });

            test("should clear value if it's not in source array and re-render dropdown", async () => {
                await comboboxTypeahead.waitElementVisible();
                await comboboxTypeahead.acceptInput("Not in a source array");
                await comboboxTypeahead.toggleMenu();
                await expect(comboboxTypeahead.getSelectedItems()).toHaveCount(0);
                await comboboxTypeahead.toggleMenu();
                await Helpers.page.waitForTimeout(500); // wait for dropdown to re-render
                expect(await comboboxTypeahead.getInputValue()).toEqual("");
            });
        });

        test.describe("with HTML-like strings, passed in source array", () => {
            test("should display HTML-like strings as strings and should not render them as DOM elements", async () => {
                await comboboxHTMLItems.waitElementVisible();
                await comboboxHTMLItems.toggleMenu();
                expect(await comboboxHTMLItems.getItemText(1)).toEqual(
                    "<button>Button 1</button>"
                );
                await comboboxHTMLItems.toggleMenu();
                await comboboxHTMLItems.select("<button>Button 1</button>");
                expect(await comboboxHTMLItems.getInputValue()).toEqual(
                    "<button>Button 1</button>"
                );
            });
        });

        test.describe("focus >", () => {
            test.beforeEach(async () => {
                await comboboxBasic.waitElementVisible();
            });

            test("should be focused via keyboard", async () => {
                await Helpers.pressKey("Tab");
                const inputClass = await comboboxBasic.getInput().getAttribute("class");
                const activeElementClass = await Helpers.page.evaluate(() => document.activeElement?.getAttribute("class"));
                expect(activeElementClass).toBe(inputClass);
            });

            test("should be focused via js", async () => {
                await comboboxBasic.getInput().evaluate((el: any) => el.focus());
                const inputClass = await comboboxBasic.getInput().getAttribute("class");
                const activeElementClass = await Helpers.page.evaluate(() => document.activeElement?.getAttribute("class"));
                expect(activeElementClass).toBe(inputClass);
            });

            test("should be keyboard navigated and able to select an item", async () => {
                await comboboxBasic.toggleMenu();
                await Helpers.pressKey("ArrowDown", 3);
                await Helpers.pressKey("Enter");
                expect(await comboboxBasic.getInputValue()).toMatch("Item 3");
            });
        });

        test.describe("custom template >", () => {
            test.beforeEach(async () => {
                await comboboxWithTemplate.waitElementVisible();
            });

            test("applies the correct template", async () => {
                await comboboxWithTemplate.toggleMenu();
                const itemsWithNestedClass = Helpers.page.locator(
                    ".nui-overlay .combobox-examples-custom-template"
                );
                await expect(itemsWithNestedClass).toHaveCount(5);
            });
        });

        test.describe("removeValueButton >", () => {
            test.beforeEach(async () => {
                await comboboxRemoveValueButton.waitElementVisible();
            });
            test("should display removeValue button when text is typed", async () => {
                await expect(comboboxRemoveValueButton.clearButton.getLocator()).toHaveCount(0);
                const inputText = "Some text";
                await comboboxRemoveValueButton.acceptText(inputText);
                await expect(comboboxRemoveValueButton.clearButton.getLocator()).toHaveCount(1);
            });

            test("should clear input value when clicking the button", async () => {
                const inputText = "Some text";
                await comboboxRemoveValueButton.acceptText(inputText);
                await comboboxRemoveValueButton.clearButton.click();
                expect(await comboboxRemoveValueButton.getInputValue()).toEqual("");
            });

            test("should have removalValue button when selected item and clear value when clicking the button", async () => {
                await comboboxRemoveValueButton.select("Item 1");
                await expect(comboboxRemoveValueButton.clearButton.getLocator()).toHaveCount(1);

                await comboboxRemoveValueButton.clearButton.click();
                expect(await comboboxRemoveValueButton.getInputValue()).toEqual("");
            });
        });
    });
});
