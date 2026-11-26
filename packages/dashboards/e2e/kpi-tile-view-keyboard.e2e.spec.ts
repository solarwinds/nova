import { expect, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

test.describe("KPI tile view keyboard interaction", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("docs/widget-types/view-components", page);
    });

    test("should activate interactive no-link tiles with Enter and Space", async ({
        page,
    }) => {
        const activeSessions = page.getByRole("button", {
            name: /Active Sessions/,
        });
        const uptime = page.getByRole("button", { name: /Uptime/ });

        await expect(activeSessions).toBeVisible();
        await expect(uptime).toBeVisible();

        await activeSessions.click();
        expect(
            await activeSessions.evaluate(element =>
                element.matches(":focus-visible")
            )
        ).toBe(false);

        await uptime.click();
        await expect(page.getByText("Last clicked: Uptime")).toBeVisible();
        await page.keyboard.press("Shift+Tab");
        await expect(activeSessions).toBeFocused();
        await expect
            .poll(async () =>
                activeSessions.evaluate(
                    element => getComputedStyle(element, "::after").outlineStyle
                )
            )
            .toBe("solid");
        await page.keyboard.press("Enter");
        await expect(
            page.getByText("Last clicked: Active Sessions")
        ).toBeVisible();

        await uptime.press("Enter");
        await expect(page.getByText("Last clicked: Uptime")).toBeVisible();
        await activeSessions.focus();
        const scrollY = await page.evaluate(() => window.scrollY);
        await page.keyboard.press("Space");
        await expect(
            page.getByText("Last clicked: Active Sessions")
        ).toBeVisible();
        await expect
            .poll(async () => page.evaluate(() => window.scrollY))
            .toBe(scrollY);

        await uptime.focus();
        await page.keyboard.press("Enter");
        await expect(page.getByText("Last clicked: Uptime")).toBeVisible();
    });

    for (const theme of ["light", "dark", "forced-colors"]) {
        test(`should show keyboard-only focus in ${theme}`, async ({
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
            const tile = page.getByRole("button", { name: /Uptime/ });
            await tile.hover();
            const mouseAppearance = await tile.screenshot();
            await tile.click();
            await expect(page.getByText("Last clicked: Uptime")).toBeVisible();
            expect(await tile.screenshot()).toEqual(mouseAppearance);
            expect(
                await tile.evaluate(
                    element => getComputedStyle(element, "::after").content
                )
            ).toBe("none");

            await page.keyboard.press("Shift+Tab");
            await page.keyboard.press("Tab");
            await expect(tile).toBeFocused();
            const outline = await tile.evaluate(element => {
                const style = getComputedStyle(element, "::after");
                return {
                    style: style.outlineStyle,
                    width: style.outlineWidth,
                    offset: style.outlineOffset,
                    pointerEvents: style.pointerEvents,
                };
            });
            expect(outline).toEqual({
                style: "solid",
                width: "2px",
                offset: "-2px",
                pointerEvents: "none",
            });
            expect(await tile.screenshot()).not.toEqual(mouseAppearance);
        });
    }
});
