import { IconAtom } from "./icon.atom";
import { test, Helpers } from "../../setup";

describe("a11y: icon", () => {
    const rulesToDisable: string[] = [
        "duplicate-id", // has nothing to do with the icons
    ];

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("icon/icon-visual-test", page);
    });

    test("should check a11y of icon", async ({ runA11yScan }) => {
        await runA11yScan(IconAtom, rulesToDisable);
    });
});
