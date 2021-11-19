import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { ToolbarAtom } from "../public_api";

// The test passes, but for some reason hangs in the end and eventually fails with timeout
// Investigate in the scope of NUI-6042
xdescribe("a11y: toolbar", () => {
    const rulesToDisable: string[] = [
        "color-contrast", // NUI-6014
        "landmark-is-unique",
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("toolbar/toolbar-visual-test");
    });

    it("should check a11y of toolbar", async () => {
        await assertA11y(browser, ToolbarAtom.CSS_CLASS, rulesToDisable);
    });
});
