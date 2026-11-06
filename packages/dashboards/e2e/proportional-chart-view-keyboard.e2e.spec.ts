import { expect, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

test.describe("Proportional chart view keyboard access", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("test/proportional-chart-view", page);
    });

    test("activates native actions once and preserves links and visibility", async ({
        page,
    }) => {
        const legend = page.getByRole("list");
        await expect(legend.getByRole("listitem")).toHaveCount(2);
        const alpha = legend.getByRole("button", { name: "Alpha 30" });
        const beta = legend.getByRole("button", { name: "Beta 70" });
        await page.getByRole("button", { name: "Before legend" }).focus();
        await page.keyboard.press("Tab");
        await expect(alpha).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(
            page.getByText("Actions: 1; Last item: alpha")
        ).toBeVisible();
        const scroll = await page.evaluate(() => window.scrollY);
        await page.keyboard.press("Space");
        await expect(
            page.getByText("Actions: 2; Last item: alpha")
        ).toBeVisible();
        expect(await page.evaluate(() => window.scrollY)).toBe(scroll);
        await page.keyboard.press("Tab");
        await expect(legend.getByRole("link", { name: "Beta" })).toBeFocused();
        await expect(
            legend.getByRole("link", { name: "Beta" })
        ).toHaveAttribute("href", "#/test/proportional-chart-view?item=beta");
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(
            /#\/test\/proportional-chart-view\?item=beta$/
        );
        await expect(
            page.getByText("Actions: 2; Last item: alpha")
        ).toBeVisible();
        await page.keyboard.press("Tab");
        await expect(beta).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(
            page.getByText("Actions: 3; Last item: beta")
        ).toBeVisible();
        await expect(legend.getByRole("checkbox")).toHaveCount(0);
        await expect(
            legend.locator(".nui-legend-series--state-hidden")
        ).toHaveCount(0);
    });

    test("keeps projected links independent of the action button", async ({
        page,
    }) => {
        await page
            .getByRole("button", { name: "Toggle custom template" })
            .click();
        const legend = page.getByRole("list");
        await page.getByRole("button", { name: "Before legend" }).focus();
        await page.keyboard.press("Tab");
        await expect(
            legend.getByRole("link", { name: "More Alpha" })
        ).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(
            /#\/test\/proportional-chart-view\?item=alpha$/
        );
        await expect(page.getByText("Actions: 0; Last item:")).toBeVisible();
        await page.keyboard.press("Tab");
        await expect(
            legend.getByRole("button", { name: "Alpha 30" })
        ).toBeFocused();
        await page.keyboard.press("Space");
        await expect(
            page.getByText("Actions: 1; Last item: alpha")
        ).toBeVisible();
        await expect(legend.getByRole("button").getByRole("link")).toHaveCount(
            0
        );
    });

    test("preserves pointer hover, click and layout without showing an extra control", async ({
        page,
    }) => {
        const legend = page.getByRole("list");
        const alpha = legend.getByRole("listitem").first();
        await alpha.hover();
        const appearance = await legend.screenshot();
        const baseline = await page.addStyleTag({
            content: `
                .proportional-chart__legend-action { display: none !important; }
                .proportional-chart__legend-series { position: static !important; }
            `,
        });
        expect(await legend.screenshot()).toEqual(appearance);
        await baseline.evaluate(element => element.remove());
        await alpha.click();
        await expect(
            page.getByText("Actions: 1; Last item: alpha")
        ).toBeVisible();
        await expect(alpha.locator("button")).not.toBeFocused();
        await page.mouse.move(0, 0);
        await expect(
            legend.locator(".nui-legend-series--state-deemphasized")
        ).toHaveCount(0);
    });

    for (const theme of ["light", "dark", "forced-colors"]) {
        test(`emphasizes focused non-action items with keyboard-only focus in ${theme}`, async ({
            page,
        }) => {
            await page.emulateMedia({
                forcedColors: theme === "forced-colors" ? "active" : "none",
            });
            await page.evaluate(dark => {
                document.documentElement.classList.toggle(
                    "dark-nova-theme",
                    dark
                );
            }, theme === "dark");
            const action = page.getByRole("list").getByRole("button").first();
            await page.getByRole("button", { name: "Before legend" }).focus();
            await page.keyboard.press("Tab");
            await expect(action).toBeFocused();
            await expect(action).toHaveCSS("outline-style", "solid");
            await expect(action).toHaveCSS("outline-width", "2px");
            await page
                .getByRole("button", { name: "Toggle interaction" })
                .click();
            const legend = page.getByRole("list");
            const alpha = legend.getByRole("listitem").first();
            const beta = legend.getByRole("listitem").last();
            await alpha.hover();
            const pointer = await alpha.screenshot();
            await alpha.click();
            expect(await alpha.screenshot()).toEqual(pointer);
            await page.mouse.move(0, 0);
            await page.getByRole("button", { name: "Before legend" }).focus();
            await page.keyboard.press("Tab");
            await expect(alpha).toBeFocused();
            await expect(alpha).toHaveCSS("outline-style", "solid");
            await expect(alpha).toHaveCSS("outline-width", "2px");
            await expect(
                beta.locator(".nui-legend-series--state-deemphasized")
            ).toHaveCount(1);
            await beta.hover();
            await expect(
                alpha.locator(".nui-legend-series--state-deemphasized")
            ).toHaveCount(1);
            await page.mouse.move(0, 0);
            await expect(
                beta.locator(".nui-legend-series--state-deemphasized")
            ).toHaveCount(1);
            await page.getByRole("button", { name: "After legend" }).focus();
            await expect(
                legend.locator(".nui-legend-series--state-deemphasized")
            ).toHaveCount(0);
            await expect(legend.getByRole("button")).toHaveCount(0);
            await expect(alpha.locator("button[legendAction]")).toHaveCount(0);
            await expect(
                page.getByText("Actions: 0; Last item:")
            ).toBeVisible();
        });
    }
});
