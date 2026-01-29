import { TextboxAtom } from "./textbox.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";

test.describe("USERCONTROL textbox >", () => {
    let textBox: TextboxAtom;
    let disabledTextbox: TextboxAtom;
    let readonlyTextbox: TextboxAtom;
    let customWidthTextbox: TextboxAtom;
    let requiredTextbox: TextboxAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("textbox", page);
        textBox = Atom.find<TextboxAtom>(
            TextboxAtom,
            "demo-options-textbox-item"
        );
        disabledTextbox = Atom.find<TextboxAtom>(
            TextboxAtom,
            "demo-options-disabled-textbox-item"
        );
        requiredTextbox = Atom.find<TextboxAtom>(
            TextboxAtom,
            "demo-options-required-textbox-item"
        );
        readonlyTextbox = Atom.find<TextboxAtom>(
            TextboxAtom,
            "demo-options-readonly-textbox-item"
        );
        customWidthTextbox = Atom.find<TextboxAtom>(
            TextboxAtom,
            "demo-options-custom-width-textbox-item"
        );
    });

    test(`should have native input element without "disabled" attribute by default`, async () => {
        await textBox.toNotBeDisabled();
    });

    test(`should have native input element with "disabled" attribute`, async () => {
        await disabledTextbox.toBeDisabled();
    });

    test(`should have native input element with "readonly" attribute`, async () => {
        await readonlyTextbox.toBeReadOnly();
    });

    test("allows to change width", async () => {
        await expect
            .poll(
                async () =>
                    await customWidthTextbox.input.evaluate(
                        (el: HTMLElement) => el.offsetWidth
                    )
            )
            .toBeCloseTo(200);
    });

    test.describe("validation 'required' >", () => {
        test("should reflect error when required field is empty", async () => {
            await requiredTextbox.toHaveError();
            await requiredTextbox.acceptText("42");
            await requiredTextbox.toNotHaveError();
        });
    });

    // TODO: disabled, since validation messages are moved to separate component and cannot be used outside of form. To be changed (delete/move)
    // xdescribe("testing sync and async validation", () => {
    //     beforeEach(async () => {
    //         if ((await asyncCheckbox.isChecked()) === false) {
    //             await asyncCheckbox.toggle();
    //         }
    //
    //         // Validation is not triggered by default
    //         expect(await validationMessage.isPresent()).toBe(false);
    //     });
    //
    //     test("should spinner be visible during the async validate of the textbox", async () => {
    //         await textBox.clearText();
    //         await textBox.acceptText("abcde");
    //         await asyncSpinner.waitForDisplayed(5000);
    //         expect(await asyncSpinner.isDisplayed()).toBe(true);
    //     });
    //
    //     test("should prevent async validation if sync is triggered first", async () => {
    //         await textBox.clearText();
    //         await textBox.acceptText("Ted");
    //         expect(await validationMessage.isDisplayed()).toBe(true);
    //         expect(await validationMessageText.getText()).not.toBe(
    //             "Ted's error"
    //         );
    //     });
    //
    //     test("should trigger sync validation on invalid value", async () => {
    //         await textBox.clearText();
    //         await textBox.acceptText("1");
    //         await browser.sleep(2000);
    //         expect(await asyncSpinner.isDisplayed()).toBe(false);
    //         await browser.watest(
    //             ExpectedConditions.visibilityOf(validationMessage),
    //             2000
    //         );
    //         expect(await validationMessage.isDisplayed()).toBe(true);
    //     });
    //
    //     test("should not trigger sync validation if user clears optional field", async () => {
    //         await textBox.clearText();
    //         await textBox.acceptText("1");
    //         await textBox.deleteTextManually();
    //         await asyncSpinner.waitForDisplayed(2000);
    //         expect(await asyncSpinner.isDisplayed()).toBe(true);
    //         await browser.sleep(2000);
    //         expect(await validationMessage.isPresent()).toBe(false);
    //     });
    //
    //     test("should show error message if async validation fails as user types letters in", async () => {
    //         // Checking the min length checkbox off for the test to get rid off sync validation
    //         await checkboxGroup.getFirst().toggle();
    //         await textBox.clearText();
    //         const ted = "Ted".spltest("");
    //
    //         // Simulating user's behavior by entering each letter one by one and checking the validation state
    //         for (let idx = 0; idx < ted.length; idx++) {
    //             const letter = ted[idx];
    //             await textBox.acceptText(letter);
    //             await asyncSpinner.waitForDisplayed(1000);
    //             if (idx !== ted.length - 1) {
    //                 await browser.sleep(2000);
    //                 expect(await validationMessage.isPresent()).toBe(false);
    //             } else {
    //                 await browser.sleep(2000);
    //                 expect(await validationMessage.isDisplayed()).toBe(true);
    //                 expect(await validationMessageText.getText()).toBe(
    //                     "Ted's error"
    //                 );
    //             }
    //         }
    //     });
    // });
});
