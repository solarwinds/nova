import { browser } from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { TabHeadingAtom, TabHeadingGroupAtom } from "../public_api";

describe("a11y: tab-heading-group", () => {
    const rulesToDisable: string[] = [
        "color-contrast", // NUI-6014
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("tabgroup/tabgroup-test");
    });

    it("should check a11y of tab-heading-group", async () => {
        await assertA11y(browser, TabHeadingAtom.CSS_CLASS, rulesToDisable);
    });

    it("should check a11y of tab-heading-group", async () => {
        await assertA11y(
            browser,
            TabHeadingGroupAtom.CSS_CLASS,
            rulesToDisable
        );
    });
});
