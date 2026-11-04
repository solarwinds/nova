import { TableAtom } from "./table.atom";
import { expect, Helpers, test } from "../../setup";

const rulesToDisable: string[] = [
    "duplicate-id", // we don't care for the testing pages
    "aria-allowed-role", // NUI-6015
    "aria-required-parent", // NUI-6133
    "nested-interactive",
];
test.describe("a11y: table", () => {
    test.beforeEach(async ({ page }): Promise<void> => {
        await Helpers.prepareBrowser("table/visual-test", page);
        await Helpers.switchDarkTheme("off");
    });

    test("should check a11y of table", async ({ runA11yScan }) => {
        await runA11yScan(TableAtom, rulesToDisable);
    });

    test("should show an inset focus indicator when tabbing to sortable sticky headers in light and dark themes", async () => {
        await Helpers.prepareBrowser("table/table-test", Helpers.page);
        const headers = Helpers.page.locator(
            "#nui-test-table th.nui-table__table-header-cell--sortable"
        );
        const firstHeader = headers.first();

        for (const theme of ["light", "dark"] as const) {
            await test.step(`Keyboard focus indicator in ${theme} theme`, async () => {
                await Helpers.switchDarkTheme(theme === "dark" ? "on" : "off");
                await expect(firstHeader).toHaveClass(
                    /nui-table__table-header-cell--sortable/
                );
                await expect(firstHeader).toHaveClass(/cdk-table-sticky/);

                // Tab between sortable headers and return with Shift+Tab so the
                // browser applies its keyboard-only :focus-visible state.
                await firstHeader.focus();
                await Helpers.page.keyboard.press("Tab");
                await expect(headers.nth(1)).toBeFocused();
                await Helpers.page.keyboard.press("Shift+Tab");
                await expect(firstHeader).toBeFocused();

                const focusStyle = await firstHeader.evaluate(element => ({
                    isFocusVisible: element.matches(":focus-visible"),
                    boxShadow: getComputedStyle(element).boxShadow,
                }));
                expect(focusStyle.isFocusVisible).toBe(true);
                expect(focusStyle.boxShadow).toContain("inset");
                expect(focusStyle.boxShadow).toMatch(/\b2px\b/);
                expect(focusStyle.boxShadow).toMatch(
                    /rgba\([^)]*,\s*0\.[1-9]\d*\)/
                );
            });
        }

        await Helpers.switchDarkTheme("off");
    });

    test("should not show a keyboard focus indicator after mouse click and should sort the column", async () => {
        await Helpers.prepareBrowser("table/table-test", Helpers.page);
        const firstHeader = Helpers.page
            .locator(
                "#nui-test-table th.nui-table__table-header-cell--sortable"
            )
            .first();

        await firstHeader.click();

        await expect(firstHeader).toHaveAttribute("aria-sort", "ascending");
        const focusStyle = await firstHeader.evaluate(element => ({
            isFocusVisible: element.matches(":focus-visible"),
            boxShadow: getComputedStyle(element).boxShadow,
        }));
        expect(focusStyle.isFocusVisible).toBe(false);
        expect(focusStyle.boxShadow).not.toContain("inset");
    });

    test("should keep the inset focus indicator when tabbing into horizontal overflow", async () => {
        await Helpers.prepareBrowser("table/table-test", Helpers.page);
        const container = Helpers.page.locator("#nui-test-table");
        await container.evaluate(element => {
            element.style.width = "400px";
        });
        await expect
            .poll(() =>
                container.evaluate(
                    element => element.scrollWidth > element.clientWidth
                )
            )
            .toBe(true);

        const headers = container.locator(
            "th.nui-table__table-header-cell--sortable"
        );
        const lastHeader = headers.last();
        await headers.nth((await headers.count()) - 2).focus();
        await Helpers.page.keyboard.press("Tab");

        await expect(lastHeader).toBeFocused();
        await expect(lastHeader).toBeInViewport();
        await expect
            .poll(() => container.evaluate(element => element.scrollLeft))
            .toBeGreaterThan(0);
        await expect(lastHeader).toHaveCSS("box-shadow", /inset/);
        expect(
            await lastHeader.evaluate(element =>
                element.matches(":focus-visible")
            )
        ).toBe(true);
    });
});
