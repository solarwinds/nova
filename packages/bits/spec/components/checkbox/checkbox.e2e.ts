import { browser, Key } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { CheckboxAtom } from "../public_api";

describe("USERCONTROL Checkbox", () => {
    let atom: CheckboxAtom;
    let atomBasic: CheckboxAtom;
    let atomIndeterminate: CheckboxAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("checkbox/checkbox-test");
        atom = Atom.find(CheckboxAtom, "nui-demo-checkbox");
        atomBasic = Atom.find(CheckboxAtom, "nui-demo-checkbox-basic");
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

    describe("Attribute section:", () => {
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
