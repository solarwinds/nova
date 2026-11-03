import { expect, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

test.describe("Widget editor focus", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("docs/widget-types/timeseries", page);
        const editMode = page
            .getByRole("checkbox", {
                name: "Edit Mode",
                exact: true,
            })
            .first();
        if ((await editMode.getAttribute("aria-checked")) !== "true") {
            await editMode.click();
        }
    });

    test("should focus the editor, contain Tab navigation, and restore focus on cancel", async ({
        page,
    }) => {
        const edit = page
            .locator("button.nui-widget-header__action-edit")
            .first();
        await edit.focus();
        await page.keyboard.press("Enter");
        const dialog = page.getByRole("dialog", {
            name: "Widget configuration",
            exact: true,
        });
        await expect(dialog).toBeVisible();
        await expect(
            dialog.locator("nui-configurator-heading button")
        ).toBeFocused();

        const tabbables = dialog.locator(
            "button:not([disabled]):not([tabindex='-1']):visible, " +
                "input:not([disabled]):not([type='hidden']):not([tabindex='-1']):visible, " +
                "[tabindex='0']:not(.cdk-focus-trap-anchor):visible, a[href]:not([tabindex='-1']):visible"
        );
        const first = tabbables.first();
        const last = tabbables.last();
        await last.focus();
        await page.keyboard.press("Tab");
        await expect(first).toBeFocused();
        await first.focus();
        await page.keyboard.press("Shift+Tab");
        await expect(last).toBeFocused();
        await dialog.locator(".nui-dashwiz-buttons__cancel-button").click();
        await expect(dialog).toHaveCount(0);
        await expect(edit).toBeFocused();
    });

    test("should preserve keyboard interaction with a nested select overlay", async ({
        page,
    }) => {
        const edit = page
            .locator("button.nui-widget-header__action-edit")
            .first();
        await edit.focus();
        await page.keyboard.press("Enter");
        const dialog = page.getByRole("dialog", {
            name: "Widget configuration",
            exact: true,
        });
        const section = dialog
            .getByRole("button", { name: "Expander", exact: true })
            .filter({ hasText: "Data Source" });
        await section.press("Enter");
        const select = dialog.getByRole("combobox", {
            name: "Select Data Source",
            exact: true,
        });
        await select.press("ArrowDown");
        await expect(dialog.getByRole("listbox")).toBeVisible();
        await expect(select).toBeFocused();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Escape");
        await expect(dialog.getByRole("listbox")).toHaveCount(0);
        await expect(select).toBeFocused();
        await expect(dialog).toBeVisible();
        await dialog
            .getByRole("button", { name: "Cancel", exact: true })
            .click();
        await expect(edit).toBeFocused();
    });

    test("should restore focus to the recreated widget after saving", async ({
        page,
    }) => {
        const widget = page
            .locator("nui-widget")
            .filter({
                has: page.locator("button.nui-widget-header__action-edit"),
            })
            .first();
        const edit = widget.locator("button.nui-widget-header__action-edit");
        const widgetId = await widget.getAttribute("widget-id");
        const oldEdit = await edit.elementHandle();
        expect(widgetId).toBeTruthy();
        expect(oldEdit).not.toBeNull();
        await edit.focus();
        await page.keyboard.press("Enter");
        const dialog = page.getByRole("dialog", {
            name: "Widget configuration",
            exact: true,
        });
        await dialog.locator(".nui-dashwiz-buttons__finish-button").click();
        await expect(dialog).toHaveCount(0);
        await expect
            .poll(() => oldEdit!.evaluate(element => element.isConnected))
            .toBe(false);
        const replacement = page.locator(`nui-widget[widget-id="${widgetId}"]`);
        const target = replacement.locator(
            "button.nui-widget-header__action-edit"
        );
        await expect
            .poll(async () =>
                page.evaluate(() =>
                    document.activeElement
                        ?.closest("nui-widget")
                        ?.getAttribute("widget-id")
                )
            )
            .toBe(widgetId);
        await expect(target.first()).toBeFocused();
        await oldEdit!.dispose();
    });
});
