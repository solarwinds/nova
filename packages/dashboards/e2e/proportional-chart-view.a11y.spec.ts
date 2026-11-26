import { expect, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

// Keyboard-only action proxies have no pointer hit area; existing pointer target sizes are unchanged.
const rulesToDisable = ["target-size"];

test.describe("a11y: proportional chart view legend", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("test/proportional-chart-view", page);
    });

    test("exposes named actions and independent links in a valid list", async ({
        page,
        runA11yScan,
    }) => {
        await expect(page.getByRole("listitem")).toHaveCount(2);
        await runA11yScan("nui-legend", rulesToDisable);
        await page
            .getByRole("button", { name: "Toggle custom template" })
            .click();
        await runA11yScan("nui-legend", rulesToDisable);
        await page.getByRole("button", { name: "Toggle interaction" }).click();
        await expect(page.getByRole("list").getByRole("button")).toHaveCount(0);
        await runA11yScan("nui-legend", rulesToDisable);
    });
});
