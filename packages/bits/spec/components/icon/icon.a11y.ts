import { browser } from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { IconAtom } from "../public_api";

describe("a11y: icon", () => {
    const rulesToDisable: string[] = [
        "duplicate-id", // has nothing to do with the icons
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("icon/icon-visual-test");
    });

    it("should check a11y of icon", async () => {
        await assertA11y(browser, IconAtom.CSS_CLASS, rulesToDisable);
    });
});
