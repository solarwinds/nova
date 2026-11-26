import { expect, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

test.describe("Timeseries legend controls", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("docs/widget-types/timeseries", page);
    });

    test("should reach visibility and drilldown independently with the keyboard", async ({
        page,
    }) => {
        const row = page
            .locator("nui-legend-series")
            .filter({
                has: page.locator("button.xy-chart__legend-drilldown", {
                    hasText: "Lisbon",
                }),
            })
            .first();
        const toggle = row.getByRole("checkbox", {
            name: "Lisbon",
            exact: true,
        });
        const action = row.getByRole("button", {
            name: "Lisbon",
            exact: true,
        });
        await expect(row).toHaveAttribute("role", "group");
        await expect(row).not.toHaveAttribute("tabindex");
        await expect(toggle.locator("button, a, input")).toHaveCount(0);
        const toggleBounds = await toggle.boundingBox();
        const tileBounds = await toggle
            .locator(".nui-legend-series__tile")
            .boundingBox();
        expect(toggleBounds).not.toBeNull();
        expect(tileBounds).not.toBeNull();
        expect(toggleBounds?.height).toBe(tileBounds?.height);
        expect(
            await action.evaluate(
                element => element.closest('[role="checkbox"]') === null
            )
        ).toBe(true);

        await toggle.focus();
        await page.keyboard.press("Enter");
        await expect(toggle).not.toBeChecked();
        await page.keyboard.press("Space");
        await expect(toggle).toBeChecked();
        await page.keyboard.press("Tab");
        await expect(action).toBeFocused();
        await page.keyboard.press("Shift+Tab");
        await expect(toggle).toBeFocused();
    });

    test("should activate drilldown and native links without changing visibility", async ({
        page,
    }) => {
        const row = page
            .locator("nui-legend-series")
            .filter({
                has: page.locator("button.xy-chart__legend-drilldown", {
                    hasText: "Lisbon",
                }),
            })
            .first();
        const toggle = row.getByRole("checkbox", {
            name: "Lisbon",
            exact: true,
        });
        const action = row.getByRole("button", {
            name: "Lisbon",
            exact: true,
        });
        let navigations = 0;
        page.on("dialog", async dialog => {
            expect(dialog.type()).toBe("beforeunload");
            navigations++;
            await dialog.dismiss();
        });
        await page.evaluate(() => {
            window.addEventListener("beforeunload", event => {
                event.preventDefault();
                event.returnValue = "";
            });
        });

        await action.focus();
        await page.keyboard.press("Enter");
        await expect.poll(() => navigations).toBe(1);
        await expect(toggle).toBeChecked();
        await page.keyboard.press("Space");
        await expect.poll(() => navigations).toBe(2);
        await expect(toggle).toBeChecked();

        const link = row.getByRole("link");
        await link.focus();
        await page.keyboard.press("Enter");
        await expect.poll(() => navigations).toBe(3);
        await expect(toggle).toBeChecked();
    });
});
