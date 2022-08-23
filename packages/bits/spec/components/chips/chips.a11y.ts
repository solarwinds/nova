import { browser } from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { ChipsAtom } from "../public_api";

describe("a11y: chips", () => {
    const rulesToDisable: string[] = ["color-contrast"];

    beforeAll(async () => {
        await Helpers.prepareBrowser("chips/chips-visual-test");
    });

    it("should verify a11y of chips", async () => {
        await assertA11y(browser, ChipsAtom.CSS_CLASS, rulesToDisable);
    });
});
