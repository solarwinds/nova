import {
    browser,
    by,
    element,
    ElementFinder,
    ExpectedConditions,
} from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import {
    CheckboxAtom,
    CheckboxGroupAtom,
    SpinnerAtom,
    TextboxAtom,
} from "../public_api";

describe("USERCONTROL textbox >", () => {

    let textBox: TextboxAtom;
    let disabledTextbox: TextboxAtom;
    let readonlyTextbox: TextboxAtom;
    let customWidthTextbox: TextboxAtom;
    let requiredTextbox: TextboxAtom;
    let asyncSpinner: SpinnerAtom;
    let asyncCheckbox: CheckboxAtom;
    let checkboxGroup: CheckboxGroupAtom;
    let validationMessage: ElementFinder;
    let validationMessageText: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("textbox");
        asyncCheckbox = Atom.find(CheckboxAtom, "nui-demo-async-checkbox");
        textBox = Atom.find(TextboxAtom, "demo-options-textbox-item");
        disabledTextbox = Atom.find(TextboxAtom, "demo-options-disabled-textbox-item");
        requiredTextbox = Atom.find(TextboxAtom, "demo-options-required-textbox-item");
        readonlyTextbox = Atom.find(TextboxAtom, "demo-options-readonly-textbox-item");
        customWidthTextbox = Atom.find(TextboxAtom, "demo-options-custom-width-textbox-item");
        asyncSpinner = Atom.findIn(SpinnerAtom, element(by.id("test-textbox")));
        checkboxGroup = Atom.findIn(CheckboxGroupAtom, element.all(by.className("demo-options-section")).first());
        validationMessage = element(by.className("nui-textbox__messages"));
        validationMessageText = element(by.css(".nui-textbox__messages.nui-validation > div"));
    });

    it("should have native input element without \"disabled\" attribute by default", async () => {
        expect(await textBox.disabled()).toBe(false);
    });

    it("should have native input element with \"disabled\" attribute", async () => {
        expect(await disabledTextbox.disabled()).toBe(true);
    });

    it("should have native input element with \"readonly\" attribute", async () => {
        expect(await readonlyTextbox.isReadonly()).toBe(true);
    });

    it("allows to change width", async () => {
        const baseWidth = (await customWidthTextbox.input.getSize()).width;
        expect(baseWidth).toEqual(200);
    });

    describe("validation 'required' >", () => {
        it("should reflect error when required field is empty", async () => {
            expect(await requiredTextbox.hasError()).toBe(true);
            await requiredTextbox.acceptText("42");
            expect(await requiredTextbox.hasError()).toBe(false);
        });
    });

    // TODO: disabled, since validation messages are moved to separate component and cannot be used outside of form. To be changed (delete/move)
    xdescribe("testing sync and async validation", () => {
        beforeEach(async () => {
            if (await asyncCheckbox.isChecked() === false) {
                await asyncCheckbox.toggle();
            }

            // Validation is not triggered by default
            expect(await validationMessage.isPresent()).toBe(false);
        });

        it("should spinner be visible during the async validate of the textbox", async () => {
            await textBox.clearText();
            await textBox.acceptText("abcde");
            await asyncSpinner.waitForDisplayed(5000);
            expect(await asyncSpinner.isDisplayed()).toBe(true);
        });

        it("should prevent async validation if sync is triggered first", async () => {
            await textBox.clearText();
            await textBox.acceptText("Ted");
            expect(await validationMessage.isDisplayed()).toBe(true);
            expect(await validationMessageText.getText()).not.toBe("Ted's error");
        });

        it("should trigger sync validation on invalid value", async () => {
            await textBox.clearText();
            await textBox.acceptText("1");
            await browser.sleep(2000);
            expect(await asyncSpinner.isDisplayed()).toBe(false);
            await browser.wait(ExpectedConditions.visibilityOf(validationMessage), 2000);
            expect(await validationMessage.isDisplayed()).toBe(true);
        });

        it("should not trigger sync validation if user clears optional field", async () => {
            await textBox.clearText();
            await textBox.acceptText("1");
            await textBox.deleteTextManually();
            await asyncSpinner.waitForDisplayed(2000);
            expect(await asyncSpinner.isDisplayed()).toBe(true);
            await browser.sleep(2000);
            expect(await validationMessage.isPresent()).toBe(false);
        });

        it("should show error message if async validation fails as user types letters in", async () => {
            // Checking the min length checkbox off for the test to get rid off sync validation
            await checkboxGroup.getFirst().toggle();
            await textBox.clearText();
            const ted = "Ted".split("");

            // Simulating user's behavior by entering each letter one by one and checking the validation state
            for (let idx = 0; idx < ted.length; idx++) {
                const letter = ted[idx];
                await textBox.acceptText(letter);
                await asyncSpinner.waitForDisplayed(1000);
                if (idx !== (ted.length - 1)) {
                    await browser.sleep(2000);
                    expect(await validationMessage.isPresent()).toBe(false);
                } else {
                    await browser.sleep(2000);
                    expect(await validationMessage.isDisplayed()).toBe(true);
                    expect(await validationMessageText.getText()).toBe("Ted's error");
                }
            }
        });
    });
});
