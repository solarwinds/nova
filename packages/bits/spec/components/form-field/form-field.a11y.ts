import { browser } from "protractor";

import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { ButtonAtom } from "../public_api";

describe("a11y: form-field", () => {
    let toggleButton: ButtonAtom;
    let rulesToDisable: string[] = [
        "aria-allowed-role", // disabling because checkboxes are on the page
        "bypass", // because we're not on a real app's page
        "color-contrast",
        "landmark-one-main", // not applicable in the test context
        "region", // not applicable in the test context
        "page-has-heading-one", // not applicable for the tests
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("form-field/form-field-test");
        toggleButton = Atom.find(ButtonAtom, "nui-form-field-test-toggle-disable-state-button");
    });

    it("button", async () => {
        await assertA11y(browser, "nui-demo", rulesToDisable);
    });

    it("textbox", async () => {
        await toggleButton.click();
        await assertA11y(browser, "nui-demo", rulesToDisable);
    });
});
