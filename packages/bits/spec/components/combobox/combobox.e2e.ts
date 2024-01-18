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

import { browser, by, ElementArrayFinder, Key, WebElement } from "protractor";

import { ComboboxAtom } from "./combobox.atom";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { TextboxNumberAtom } from "../textbox-number/textbox-number.atom";

/**
 * Consider using this as a reference to the test cases to add to the combobox-v2 test suite in scope of NUI-4902
 */
describe("USERCONTROL Combobox >", () => {
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

    beforeAll(() => {
        comboboxBasic = Atom.find(ComboboxAtom, "nui-demo-basic-combobox");
        comboboxDisabled = Atom.find(
            ComboboxAtom,
            "nui-demo-combobox-disabled"
        );
        inlineCombobox = Atom.find(ComboboxAtom, "nui-demo-inline-combobox");
        comboboxJustified = Atom.find(
            ComboboxAtom,
            "nui-demo-justified-combobox"
        );
        comboboxRequired = Atom.find(
            ComboboxAtom,
            "nui-demo-combobox-required"
        );
        comboClearOnBlur = Atom.find(
            ComboboxAtom,
            "nui-demo-combobox-with-clear-on-blur"
        );
        comboboxWithIcon = Atom.find(
            ComboboxAtom,
            "nui-demo-combobox-with-icon"
        );
        reactiveFormCombobox = Atom.find(
            ComboboxAtom,
            "nui-demo-combobox-reactive-form"
        );
        comboboxWithDisplayValue = Atom.find(
            ComboboxAtom,
            "nui-demo-display-value-combobox"
        );
        comboboxTypeahead = Atom.find(
            ComboboxAtom,
            "nui-demo-combobox-typeahead"
        );
        comboboxSeparators = Atom.find(
            ComboboxAtom,
            "nui-demo-combobox-separators"
        );
        comboboxHTMLItems = Atom.find(
            ComboboxAtom,
            "nui-demo-combobox-html-in-items"
        );
        comboboxWithTemplate = Atom.find(
            ComboboxAtom,
            "nui-demo-combobox-with-template"
        );
        comboboxAppendToBody = Atom.find(
            ComboboxAtom,
            "nui-demo-combobox-append-to-body"
        );
        comboboxRemoveValueButton = Atom.find(
            ComboboxAtom,
            "nui-demo-combobox-remove-value-button"
        );
    });

    beforeEach(async () => {
        await Helpers.prepareBrowser("combobox/combobox-test");
    });

    describe("combobox >", () => {
        describe("basic >", () => {
            it("should display placeholder", async () => {
                const placeholder = "Select item";
                expect(await comboboxBasic.getComboboxPlaceholder()).toEqual(
                    placeholder
                );
            });

            it("contains expected items", async () => {
                await comboboxBasic.toggleMenu();
                expect(await comboboxBasic.getItemsCount()).toEqual(15);
                expect(await comboboxBasic.getItemText(0)).toEqual("Item 1");
                expect(await comboboxBasic.getItemText(4)).toEqual("Item 5");
            });

            it("should display empty string by default", async () => {
                expect(await comboboxBasic.getInputValue()).toEqual("");
            });

            it("should change the model after changing the text input", async () => {
                const inputText = "Some text";
                await comboboxBasic.acceptText(inputText);
                expect(await comboboxBasic.getInputValue()).toEqual(inputText);
            });

            describe("when a value is picked from combobox, it", () => {
                it("should display selected item, change input value and model after clicking on dropdown item", async () => {
                    const target = "Item 1";
                    await comboboxBasic.select(target);
                    expect(await comboboxBasic.getInputValue()).toEqual(target);
                });

                it("should mark the selected item in the combobox menu", async () => {
                    const target = "Item 2";
                    await comboboxBasic.select(target);
                    await comboboxBasic.toggleMenu();
                    const selectedItem = comboboxBasic.getSelectedItem();
                    expect(
                        (await selectedItem.getAttribute("innerText")).trim()
                    ).toEqual(target);
                });
            });

            describe("on blur event", () => {
                it("should save new value on blur event if input value has changed", async () => {
                    const oldValue = "Item 1";
                    const newValue = "Item 2";
                    await comboboxBasic.select(oldValue);
                    await comboboxBasic.toggleMenu();
                    await comboboxBasic.clearText();
                    await comboboxBasic.acceptInput(newValue);
                    const selectedItem = comboboxBasic.getSelectedItem();
                    expect(
                        (await selectedItem.getAttribute("innerText")).trim()
                    ).toEqual(newValue);
                });
            });
        });

        describe("disabled >", () => {
            it("should have disabled styling", async () => {
                expect(await comboboxDisabled.getInput().isEnabled()).toEqual(
                    false
                );
            });
        });

        describe("clear on blur >", () => {
            it("should clear input on blur if it's value is not in source array", async () => {
                await comboClearOnBlur.acceptInput("Not in a source array");
                await comboboxBasic.toggleMenu();
                expect(
                    await comboClearOnBlur.getSelectedItems().count()
                ).toEqual(0);
            });

            it("should keep input value in input on blur if it's value is in source array", async () => {
                await comboClearOnBlur.acceptInput("Item 1");
                await comboboxBasic.toggleMenu();
                expect(await comboClearOnBlur.getInputValue()).toEqual(
                    "Item 1"
                );
            });
        });

        describe("justified >", () => {
            let widthInput: TextboxNumberAtom;
            let component: WebElement;
            let parent: WebElement;

            beforeEach(() => {
                widthInput = Atom.find(
                    TextboxNumberAtom,
                    "nui-test-width-input"
                );
                component = comboboxJustified.getElementByClass(
                    "nui-combobox__layout-block"
                );
                parent = browser.element(
                    by.id("nui-demo-justified-combobox-container")
                );
            });

            it("should respect width bigger than default", async () => {
                // 500 is already in input on a view
                await compareWidths(500);
            });

            it("should respect width smaller than default", async () => {
                await widthInput.clearText();
                await widthInput.acceptText("60");
                await compareWidths(60);
            });

            async function compareWidths(expectedValue: number) {
                const componentWidth = (await component.getSize()).width;
                const containerOuterWidth = (await parent.getSize()).width;
                const containerLeftPadding = parseFloat(
                    await parent.getCssValue("padding-left")
                );
                const containerRightPadding = parseFloat(
                    await parent.getCssValue("padding-right")
                );
                const containerWidth =
                    containerOuterWidth -
                    containerLeftPadding -
                    containerRightPadding;

                expect(componentWidth).toEqual(containerWidth);
                expect(componentWidth).toEqual(expectedValue);
            }
        });

        describe("required >", () => {
            it("should display selection-required hints when focused when is-required is true", async () => {
                // pristine
                expect(
                    await comboboxRequired.isRequiredStyleDisplayed()
                ).toEqual(true);
                // focus
                await comboboxRequired.toggleMenu();
                expect(
                    await comboboxRequired.isRequiredStyleDisplayed()
                ).toEqual(true);
            });

            it("should not indicate error state if item is selected", async () => {
                // pristine
                expect(
                    await comboboxRequired.isRequiredStyleDisplayed()
                ).toEqual(true);
                // focus and select
                await comboboxRequired.select("Item 5");
                expect(
                    await comboboxRequired.isRequiredStyleDisplayed()
                ).toEqual(false);
                // blur after select
                await comboboxBasic.toggleMenu();
                expect(
                    await comboboxRequired.isRequiredStyleDisplayed()
                ).toEqual(false);
                // focus again
                await comboboxRequired.toggleMenu();
                expect(
                    await comboboxRequired.isRequiredStyleDisplayed()
                ).toEqual(false);
                // blur again
                await comboboxBasic.toggleMenu();
                expect(
                    await comboboxRequired.isRequiredStyleDisplayed()
                ).toEqual(false);
            });
        });

        describe("inline >", () => {
            it("should have proper styles", async () => {
                const comboboxContainerDisplayStyle = await inlineCombobox
                    .getLayoutBlock()
                    .getCssValue("display");
                expect(comboboxContainerDisplayStyle).toEqual("inline-flex");
            });
        });

        describe("icon adjustment >", () => {
            it("should contain icon with type 'add'", async () => {
                expect(await comboboxWithIcon.getIconName()).toEqual("add");
            });
        });

        describe("display value >", () => {
            it("should show correct values in input and dropdown", async () => {
                await comboboxWithDisplayValue.select("Item 1");
                expect(await comboboxWithDisplayValue.getInputValue()).toEqual(
                    "Item 1"
                );
            });
        });

        describe("reactive form >", () => {
            it("should not have error class when form is submitted and control is valid", async () => {
                const submitButton = browser.element(
                    by.css(`button[type='submit']`)
                );
                await submitButton.click();
                expect(
                    await reactiveFormCombobox.isRequiredStyleDisplayed()
                ).toBe(false);
                expect(
                    await reactiveFormCombobox.isRequiredStyleDisplayed()
                ).toBe(false);
            });

            it("should set value both in textbox and menu when item is set from reactive form", async () => {
                const submitButton = browser.element(
                    by.css(`button[type = 'submit']`)
                );
                await submitButton.click();
                await reactiveFormCombobox.toggleMenu();
                expect(
                    await reactiveFormCombobox.isRequiredStyleDisplayed()
                ).toBe(false);
                expect(await reactiveFormCombobox.getInputValue()).toEqual(
                    "Item 2"
                );
                expect(
                    await reactiveFormCombobox.getSelectedItems().count()
                ).toEqual(1);
                expect(
                    await reactiveFormCombobox.isRequiredStyleDisplayed()
                ).toBe(false);
            });

            it("should have error class when form is submitted and control is not valid", async () => {
                const submitButton = browser.element(
                    by.css(`button[type = 'submit']`)
                );
                await submitButton.click();
                expect(
                    await reactiveFormCombobox.isRequiredStyleDisplayed()
                ).toBe(false);
                await reactiveFormCombobox.textbox.deleteTextManually();
                await submitButton.click();
                expect(
                    await reactiveFormCombobox.isRequiredStyleDisplayed()
                ).toBe(true);
            });
        });

        describe("typeahead >", () => {
            // Will be enabled in scope of NUI-2357
            xit("should re-render dropdown for combobox with a plain list of items", async () => {
                await comboboxTypeahead.toggleMenu();
                expect(await comboboxTypeahead.getItemsCount()).toEqual(9);
                await comboboxTypeahead.acceptInput("Item 1");
                expect(await comboboxTypeahead.getItemsCount()).toEqual(4);
            });

            it("should re-render dropdown for combobox with groups", async () => {
                await comboboxSeparators.toggleMenu();
                expect(await comboboxSeparators.getItemsCount()).toEqual(9);
                await comboboxSeparators.acceptText("Item 1");
                expect(await comboboxSeparators.getItemsCount()).toEqual(3);
            });
        });

        describe("highlight >", () => {
            it("should highlight appropriate items in dropdown for combobox with a plain list of items", async () => {
                await comboboxBasic.toggleMenu();
                await comboboxBasic.acceptInput("Item");
                expect(await comboboxBasic.getHighlightedItemsCount()).toEqual(
                    15
                );
                await comboboxBasic.clearText();
                await comboboxBasic.acceptInput("Item 1");
                expect(await comboboxBasic.getHighlightedItemsCount()).toEqual(
                    6
                );
            });

            it("should highlight appropriate items in dropdown for combobox with groups", async () => {
                await comboboxSeparators.toggleMenu();
                await comboboxSeparators.acceptInput("Item");
                expect(
                    await comboboxSeparators.getHighlightedItemsCount()
                ).toEqual(9);
                await comboboxSeparators.clearText();
                await comboboxSeparators.acceptInput("Item 1");
                expect(
                    await comboboxSeparators.getHighlightedItemsCount()
                ).toEqual(3);
            });
        });

        describe("typeahead, displayValue, clearOnBlur >", () => {
            it("should not clear value after it's selected after dropdown", async () => {
                await comboboxTypeahead.select("Item 111");
                await comboboxTypeahead.toggleMenu();
                expect(await comboboxTypeahead.getItemsCount()).toEqual(2);
                expect(await comboboxTypeahead.getInputValue()).toEqual(
                    "Item 111"
                );
            });

            it("should clear value if it's not in source array and re-render dropdown", async () => {
                await comboboxTypeahead.acceptInput("Not in a source array");
                await comboboxWithDisplayValue.toggleMenu();
                expect(
                    await comboboxTypeahead.getSelectedItems().count()
                ).toEqual(0);
                await comboboxTypeahead.toggleMenu();
                expect(await comboboxTypeahead.getItemsCount()).toEqual(9);
            });
        });

        describe("with HTML-like strings, passed in source array", () => {
            it("should display HTML-like strings as strings and should not render them as DOM elements", async () => {
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

        describe("focus >", () => {
            it("should be focused via keyboard", async () => {
                await browser.actions().sendKeys(Key.TAB).perform();
                const inputClass = await comboboxBasic
                    .getInput()
                    .getAttribute("class");
                const activeElementClass = await (
                    await browser.switchTo().activeElement()
                ).getAttribute("class");
                expect(activeElementClass).toBe(inputClass);
            });

            it("should be focused via js", async () => {
                await browser.executeScript(
                    "arguments[0].focus()",
                    await comboboxBasic.getInput().getWebElement()
                );
                const inputClass = await comboboxBasic
                    .getInput()
                    .getAttribute("class");
                const activeElementClass = await (
                    await browser.switchTo().activeElement()
                ).getAttribute("class");
                expect(activeElementClass).toBe(inputClass);
            });

            it("should be keyboard navigated and able to select an item", async () => {
                await comboboxBasic.toggleMenu();
                await Helpers.pressKey(Key.ARROW_DOWN, 3);
                await Helpers.pressKey(Key.ENTER);
                expect(await comboboxBasic.getInputValue()).toMatch("Item 3");
            });
        });

        describe("custom template >", () => {
            it("applies the correct template", async () => {
                await comboboxWithTemplate.toggleMenu();
                const getItemsWithNestedClass = (): ElementArrayFinder =>
                    comboboxWithTemplate
                        .getElement()
                        .all(
                            by.css(
                                ".nui-overlay .combobox-examples-custom-template"
                            )
                        );
                expect(await getItemsWithNestedClass().count()).toEqual(5);
            });
        });

        // TODO: Enable and adjust in scope of NUI-4879
        xdescribe("appendToBody >", () => {
            it("detached popup menu should be opened and appended to body", async () => {
                await comboboxAppendToBody.toggleMenu();
                expect(
                    await comboboxAppendToBody.popup.isOpenedAppendToBody()
                ).toBe(true);
            });

            it("detached popup menu should have same width as combo's container", async () => {
                await comboboxAppendToBody.toggleMenu();
                const popupSize = await comboboxAppendToBody.popup
                    .getPopupBoxDetachedArea()
                    .getSize();
                const comboSize = await comboboxAppendToBody
                    .getContainer()
                    .getSize();
                expect(popupSize.width).toBe(comboSize.width);
            });
        });

        describe("removeValueButton >", () => {
            it("should display removeValue button when text is typed", async () => {
                expect(
                    await comboboxRemoveValueButton.clearButton.isPresent()
                ).toBeFalsy();
                const inputText = "Some text";
                await comboboxRemoveValueButton.acceptText(inputText);
                expect(
                    await comboboxRemoveValueButton.clearButton.isPresent()
                ).toBeTruthy();
            });

            it("should clear input value when clicking the button", async () => {
                const inputText = "Some text";
                await comboboxRemoveValueButton.acceptText(inputText);
                await comboboxRemoveValueButton.clearButton.click();
                expect(await comboboxRemoveValueButton.getInputValue()).toEqual(
                    ""
                );
            });

            it("should have removalValue button when selected item and clear value when clicking the button", async () => {
                await comboboxRemoveValueButton.select("Item 1");
                expect(
                    await comboboxRemoveValueButton.clearButton.isPresent()
                ).toBeTruthy();

                await comboboxRemoveValueButton.clearButton.click();
                expect(await comboboxRemoveValueButton.getInputValue()).toEqual(
                    ""
                );
            });
        });
    });
});
