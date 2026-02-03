import { CheckboxAtom } from "./checkbox.atom";
import { test, Helpers } from "../../setup";

// disabling the rule until NUI-6015 is addressed
const rulesToDisable: string[] = ["aria-allowed-role", "nested-interactive"];

test.describe("a11y: checkbox", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("checkbox/checkbox-visual-test", page);
    });

    test("should verify a11y of checkbox", async ({ runA11yScan }) => {
        await runA11yScan(CheckboxAtom, rulesToDisable);
    });
});
