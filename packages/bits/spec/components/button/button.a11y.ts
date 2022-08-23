import { browser } from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { ButtonAtom } from "../public_api";

describe("a11y: button", () => {
    const rulesToDisable: string[] = ["duplicate-id-active"];

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
        await Helpers.prepareBrowser("button/button-visual-test");
    });

    it("should verify a11y of button", async () => {
        await assertA11y(browser, ButtonAtom.CSS_CLASS, rulesToDisable);
    });
});
