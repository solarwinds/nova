import { browser } from "protractor";

import { Animations, assertA11y, Helpers } from "../../helpers";
import { SpinnerAtom } from "../public_api";

describe("a11y: spinner", () => {
    const rulesToDisable: string[] = [];

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
        await Helpers.prepareBrowser("spinner/spinner-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
    });

    it("should check a11y of spinner", async () => {
        await assertA11y(browser, SpinnerAtom.CSS_CLASS, rulesToDisable);
    });
});
