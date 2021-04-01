import each from "lodash/each";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { TextboxNumberAtom } from "./textbox-number.atom";
import { browser, Key } from "protractor";

describe("USERCONTROL textbox-number >", () => {

    let component: TextboxNumberAtom;

    let basic: TextboxNumberAtom;
    let minMax: TextboxNumberAtom;
    let disabled: TextboxNumberAtom;
    let validation: TextboxNumberAtom;
    let reactive: TextboxNumberAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("textbox/textbox-number-test");

        basic = Atom.find(TextboxNumberAtom, "test-textbox-number");
        minMax = Atom.find(TextboxNumberAtom, "test-textbox-number-min-max");
        disabled = Atom.find(TextboxNumberAtom, "test-textbox-number-disabled");
        validation = Atom.find(TextboxNumberAtom, "test-textbox-number-validation");
        reactive = Atom.find(TextboxNumberAtom, "test-textbox-number-reactive");
    });

    describe("basic behavior >", () => {
        beforeEach(async () => {
            component = basic;
            await component.clearText();
        });

        it("should be enabled and editable by default", async () => {
            expect(await component.isDisabled()).toBe(false);
            expect(await component.isReadonly()).toBe(false);
        });

        it("should increase the value when numeric up button is pressed", async () => {
            await component.upButton.click();
            expect(await component.getValue()).toBe("1");
            await component.upButton.click();
            expect(await component.getValue()).toBe("2");
        });
        // TODO: add back after NUI-5779 is finished
        xit("should decrease the value when numeric down button is pressed", async () => {
            await component.downButton.click();
            expect(await component.getValue()).toBe("-1");
            await component.downButton.click();
            expect(await component.getValue()).toBe("-2");
        });
    });

    describe("placeholder >", () => {
        beforeEach(async () => {
            component = minMax;
            await component.clearText();
        });

        it("should have proper text", async () => {
            expect(await component.getPlaceholder()).toBe("Enter value between 1 and 10");
        });
    });

    describe("disabled >", () => {
        beforeEach(async () => {
            component = disabled;
        });

        it("should disable all the child components", async () => {
            expect(await component.isDisabled()).toBe(true);
        });
    });

    describe("reactive >", () => {
        beforeEach(async () => {
            component = reactive;
        });

        it("should set the value properly", async () => {
            expect(await component.getValue()).toBe("1");
        });
    });

    describe("with min/max limits >", () => {
        beforeEach(async () => {
            component = minMax;
            await component.clearText();
        });

        describe("up buton ", () => {
            it("should be disabled if value equals to maxValue", async () => {
                await component.acceptText("10");
                expect(await component.upButton.isDisabled()).toBe(true);
            });

            it("should be disabled if value exceeds maxValue", async () => {
                await component.acceptText("100");
                expect(await component.upButton.isDisabled()).toBe(true);
            });
        });

        describe("down buton ", () => {
            it("should be disabled if value equals to minValue", async () => {
                await component.acceptText("1");
                expect(await component.downButton.isDisabled()).toBe(true);
            });

            it("should be disabled if value exceeds minValue", async () => {
                await component.acceptText("-1");
                expect(await component.downButton.isDisabled()).toBe(true);
            });
        });
    });

    describe("validation >", () => {
        beforeEach(async () => {
            component = validation;
            await component.clearText();
        });

        describe("valid values >", () => {
            it("should accept min value", async () => {
                await component.acceptText("1");
                expect(await component.isValid()).toBe(true);
            });

            it("should accept max value", async () => {
                await component.acceptText("10");
                expect(await component.isValid()).toBe(true);
            });

            it("should accept decimal value", async () => {
                await component.acceptText("5.5");
                expect(await component.isValid()).toBe(true);
            });

            it("should accept scientific notation", async () => {
                await component.acceptText("1e1");
                expect(await component.isValid()).toBe(true);
            });
        });

        describe("invalid values >", () => {
            it("should reject less than min value", async () => {
                await component.acceptText("0");
                expect(await component.isValid()).toBe(false);
            });

            it("should reject more than max value", async () => {
                await component.acceptText("11");
                expect(await component.isValid()).toBe(false);
            });

            each(["-", "+", "1e", "eee", "1-1", "1+1"], (invalidValue) => {
                it(`should reject incorrect string input: '${invalidValue}'`, async () => {
                    await component.acceptText(invalidValue);
                    expect(await component.isValid()).toBe(false);
                });
            });
        });

        it("should update validity after button click", async () => {
            await component.acceptText("-");

            expect(await component.isValid()).toBe(false);

            await component.upButton.click();

            expect(await component.isValid()).toBe(true);
            expect(await component.getValue()).toBe("1");
        });
    });

    describe("keyboard navigation", () => {
        beforeEach(async () => {
            await browser.refresh();
            component = basic;
        })

        it("should navigate between elements using TAB", async () => {
            expect("body")
                .toEqual(await browser.switchTo().activeElement().getTagName());

            await Helpers.pressKey(Key.TAB);
            expect(await component.getInputId())
                .toEqual(await browser.switchTo().activeElement().getId());

            await Helpers.pressKey(Key.TAB);
            expect(await component.upButton.getElement().getId())
                .toEqual(await browser.switchTo().activeElement().getId());

            await Helpers.pressKey(Key.TAB);
            expect(await component.downButton.getElement().getId())
                .toEqual(await browser.switchTo().activeElement().getId());
        });

        it("should switch focus from input to button on click", async () => {
            await Helpers.pressKey(Key.TAB);
            await component.downButton.click();

            expect(await component.getInputId())
                .not.toEqual(await browser.switchTo().activeElement().getId());
            expect(await component.downButton.getElement().getId())
                .toEqual(await browser.switchTo().activeElement().getId());
        })
    })
});
