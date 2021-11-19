import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { SwitchAtom } from "../public_api";

describe("a11y: switch", () => {
    const rulesToDisable: string[] = [
        "color-contrast", // NUI-6014
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("switch/switch-visual-test");
    });

    it("should check a11y of switch", async () => {
        await assertA11y(browser, SwitchAtom.CSS_CLASS, rulesToDisable);
    });
});
