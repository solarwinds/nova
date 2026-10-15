import { CheckboxAtom } from "./checkbox.atom";
import { test, Helpers, expect } from "../../setup";

// disabling the rule until NUI-6015 is addressed
const rulesToDisable: string[] = ["nested-interactive"];

test.describe("a11y: checkbox", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("checkbox/checkbox-visual-test", page);
    });

    test("should verify a11y of checkbox", async ({ runA11yScan }) => {
        await runA11yScan(CheckboxAtom, rulesToDisable);
    });

    test("should update and remove descriptions on the focusable checkbox label", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("checkbox/checkbox-test", page);
        const label = page.locator("#nui-demo-checkbox-description label");
        await expect(label).toHaveAccessibleName("Send email notifications");
        await expect(label).toHaveAccessibleDescription(
            "Messages are sent once a day. Confirm your email address first."
        );

        await page.locator("#checkbox-update-description").click();
        await expect(label).toHaveAccessibleDescription(
            "Messages are sent once a week. Confirm your email address first."
        );

        await page.locator("#checkbox-remove-description").click();
        await expect(label).toHaveAccessibleDescription("");
        await expect(label).toHaveAccessibleName("Send email notifications");
    });
});
