import { browser, Key } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { CheckboxAtom } from "../public_api";

describe("USERCONTROL Checkbox", () => {
    let atom: CheckboxAtom;
    let atomBasic: CheckboxAtom;
    let atomDisabled: CheckboxAtom;
    let atomIndeterminate: CheckboxAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("checkbox/checkbox-test");
        atom = Atom.find(CheckboxAtom, "nui-demo-checkbox");
        atomBasic = Atom.find(CheckboxAtom, "nui-demo-checkbox-basic");
        atomDisabled = Atom.find(CheckboxAtom, "nui-demo-checkbox-disabled");
        atomIndeterminate = Atom.find(CheckboxAtom, "nui-demo-checkbox-indeterminate");
    });

    describe("Value section:", () => {
        it("should check and uncheck when clicked", async () => {
            expect(await atom.isChecked()).toBe(false);

            await atom.toggle();
            expect(await atom.isChecked()).toBe(true);

            await atom.toggle();
            expect(await atom.isChecked()).toBe(false);
        });
    });

    describe("Disable section:", () => {
        it("should disable and enable when the model changes", async () => {
            expect(await atomDisabled.isDisabled()).toBe(true);
        });
    });

    describe("Attribute section:", () => {
        it("should have label", async () => {
            const label = await atom.getContent();
            expect(label).toEqual("Checkbox with help text");
        });

        it("should use help text based 'help-text' attribute", async () => {
            expect(await atom.getHelpHintText()).toEqual("This is some help text");
        });

        it("should be required", async () => {
            expect(await atom.isRequired()).toBe(true);
        });

        it("should set indeterminate value on script object from 'is-indeterminate' attribute", async () => {
            expect(await atomIndeterminate.isIndeterminate()).toEqual(true);
        });
    });

    describe("Keyboard navigation", () => {
        it("should focus checkbox and toggle with space and enter, propagating TAB", async () => {
            expect(await atomBasic.isChecked()).toBeTruthy();

            await Helpers.pressKey(Key.TAB, 2);
            await Helpers.pressKey(Key.SPACE, 1);
            expect(await atomBasic.isChecked()).toBeFalsy();

            await Helpers.pressKey(Key.ENTER, 1);
            expect(await atomBasic.isChecked()).toBeTruthy();

            await Helpers.pressKey(Key.TAB, 1);
            expect(await atomBasic.getLabel().getId()).not.toBe(await (await browser.driver.switchTo().activeElement()).getId());
        });
    });
});
