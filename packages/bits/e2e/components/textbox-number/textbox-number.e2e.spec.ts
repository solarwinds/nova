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

import { Page } from "@playwright/test";
import each from "lodash/each";

import { TextboxNumberAtom } from "./textbox-number.atom";
import { Atom } from "../../atom";

// Helper to get the active element's tag name
async function getActiveElementTag(page: Page) {
    return await page.evaluate(() =>
        document.activeElement?.tagName.toLowerCase()
    );
}

test.describe("USERCONTROL textbox-number >", () => {
    let component: TextboxNumberAtom;

    let basic: TextboxNumberAtom;
    let minMax: TextboxNumberAtom;
    let disabled: TextboxNumberAtom;
    let validation: TextboxNumberAtom;
    let reactive: TextboxNumberAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("textbox/textbox-number-test", page);

        basic = Atom.find<TextboxNumberAtom>(
            TextboxNumberAtom,
            "test-textbox-number"
        );
        minMax = Atom.find<TextboxNumberAtom>(
            TextboxNumberAtom,
            "test-textbox-number-min-max"
        );
        disabled = Atom.find<TextboxNumberAtom>(
            TextboxNumberAtom,
            "test-textbox-number-disabled"
        );
        validation = Atom.find<TextboxNumberAtom>(
            TextboxNumberAtom,
            "test-textbox-number-validation"
        );
        reactive = Atom.find<TextboxNumberAtom>(
            TextboxNumberAtom,
            "test-textbox-number-reactive"
        );
    });

    test.describe("basic behavior >", () => {
        test.beforeEach(async () => {
            component = basic;
            await component.toBeVisible();
            await component.clearText();
        });

        test("should be enabled and editable by default", async () => {
            expect(await component.isDisabled()).toBe(false);
            expect(await component.isReadonly()).toBe(false);
        });

        test("should increase the value when numeric up button is pressed", async () => {
            await component.upButton.click();
            expect(await component.getValue()).toBe("1");
            await component.upButton.click();
            expect(await component.getValue()).toBe("2");
        });
        // TODO: add back after NUI-5779 is finished
        test.skip("should decrease the value when numeric down button is pressed", async () => {
            await component.downButton.click();
            expect(await component.getValue()).toBe("-1");
            await component.downButton.click();
            expect(await component.getValue()).toBe("-2");
        });
    });

    test.describe("placeholder >", () => {
        test.beforeEach(async () => {
            component = minMax;
            await component.clearText();
        });

        test("should have proper text", async () => {
            expect(await component.getPlaceholder()).toBe(
                "Enter value between 1 and 10"
            );
        });
    });

    test.describe("disabled >", () => {
        test.beforeEach(async () => {
            component = disabled;
        });

        test("should disable all the child components", async () => {
            expect(await component.isDisabled()).toBe(true);
        });
    });

    test.describe("reactive >", () => {
        test.beforeEach(async () => {
            component = reactive;
        });

        test("should set the value properly", async () => {
            expect(await component.getValue()).toBe("1");
        });
    });

    test.describe("with min/max limits >", () => {
        test.beforeEach(async () => {
            component = minMax;
            await component.clearText();
        });

        test.describe("up button ", () => {
            test("should be disabled if value equals to maxValue", async () => {
                await component.acceptText("10");
                expect(await component.upButton.isDisabled()).toBe(true);
            });

            test("should be disabled if value exceeds maxValue", async () => {
                await component.acceptText("100");
                expect(await component.upButton.isDisabled()).toBe(true);
            });
        });

        test.describe("down button ", () => {
            test("should be disabled if value equals to minValue", async () => {
                await component.acceptText("1");
                expect(await component.downButton.isDisabled()).toBe(true);
            });

            test("should be disabled if value exceeds minValue", async () => {
                await component.acceptText("-1");
                expect(await component.downButton.isDisabled()).toBe(true);
            });
        });
    });

    test.describe("validation >", () => {
        test.beforeEach(async () => {
            component = validation;
            await component.toBeVisible();
            await component.clearText();
        });

        test.describe("valid values >", () => {
            test("should accept min value", async () => {
                await component.acceptText("1");
                expect(await component.isValid()).toBe(true);
            });

            test("should accept max value", async () => {
                await component.acceptText("10");
                expect(await component.isValid()).toBe(true);
            });

            test("should accept decimal value", async () => {
                await component.acceptText("5.5");
                expect(await component.isValid()).toBe(true);
            });

            test("should accept scientific notation", async () => {
                await component.acceptText("1e1");
                expect(await component.isValid()).toBe(true);
            });
        });

        test.describe("invalid values >", () => {
            test("should reject less than min value", async () => {
                await component.acceptText("0");
                expect(await component.isValid()).toBe(false);
            });

            test("should reject more than max value", async () => {
                await component.acceptText("11");
                expect(await component.isValid()).toBe(false);
            });

            each(["-", "+", "1e", "eee", "1-1", "1+1"], (invalidValue) => {
                test(`should reject incorrect string input: '${invalidValue}'`, async () => {
                    await component.acceptText(invalidValue);
                    expect(await component.isValid()).toBe(false);
                });
            });
        });

        test("should update validity after button click", async () => {
            await component.acceptText("-");
            expect(await component.isValid()).toBe(false);
            await component.upButton.click();
            expect(await component.isValid()).toBe(true);
            expect(await component.getValue()).toBe("1");
        });
    });

    test.describe("keyboard navigation", () => {
        test.beforeEach(async ({ page }) => {
            await page.reload();
            Helpers.setPage(page);

            component = basic;
            await component.toBeVisible();
        });

        test("should navigate between elements using TAB", async ({ page }) => {
            expect(await getActiveElementTag(page)).toEqual("body");
            await Helpers.pressKey("Tab");
            expect(await component.input.innerHTML()).toEqual(
                await Helpers.evaluateActiveElementHtml()
            );

            await Helpers.pressKey("Tab");
            expect(await component.upButton.getLocator().innerHTML()).toEqual(
                await Helpers.evaluateActiveElementHtml()
            );

            await Helpers.pressKey("Tab");
            expect(await component.downButton.getLocator().innerHTML()).toEqual(
                await Helpers.evaluateActiveElementHtml()
            );
        });

        test("should switch focus from input to button on click", async ({
            page,
        }) => {
            await Helpers.pressKey("Tab");
            await component.downButton.click();
            expect(await component.input.innerHTML()).not.toEqual(
                await Helpers.evaluateActiveElementHtml()
            );
            expect(await component.downButton.getLocator().innerHTML()).toEqual(
                await Helpers.evaluateActiveElementHtml()
            );
        });
    });
});
