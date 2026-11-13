import { expect, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

test.describe("Remove widget menu", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("docs/widget-types/timeseries", page);
        const editMode = page
            .getByRole("checkbox", { name: "Edit Mode", exact: true })
            .first();
        if ((await editMode.getAttribute("aria-checked")) !== "true") {
            await editMode.click();
        }
    });

    for (const key of ["Enter", "Space", "ArrowDown"]) {
        test(`should open with ${key} and remove only after confirmation`, async ({
            page,
        }) => {
            const widget = page
                .locator("nui-widget")
                .filter({
                    has: page.locator(".nui-widget-header__action-remove"),
                })
                .first();
            const trigger = widget.locator(
                ".nui-widget-header__action-remove button"
            );
            const originalWidget = await widget.elementHandle();
            await trigger.focus();
            await page.keyboard.press(key);
            await expect(trigger).toHaveAttribute("aria-expanded", "true");
            const action = page.getByRole("menuitem", {
                name: "Remove Widget",
                exact: true,
            });
            await expect(action).toBeVisible();
            await expect
                .poll(() =>
                    originalWidget!.evaluate(element => element.isConnected)
                )
                .toBe(true);
            await expect
                .poll(() => trigger.getAttribute("aria-activedescendant"))
                .not.toBeNull();
            await page.keyboard.press("Enter");
            await expect
                .poll(() =>
                    originalWidget!.evaluate(element => element.isConnected)
                )
                .toBe(false);
            await expect(action).toHaveCount(0);
            await originalWidget!.dispose();
        });
    }

    for (const key of ["Tab", "Shift+Tab", "Escape"]) {
        test(`should close with ${key} without removing the widget`, async ({
            page,
        }) => {
            const trigger = page
                .locator(".nui-widget-header__action-remove button")
                .first();
            await trigger.focus();
            await page.keyboard.press("Enter");
            await expect(
                page.getByRole("menuitem", {
                    name: "Remove Widget",
                    exact: true,
                })
            ).toBeVisible();
            await page.keyboard.press(key);
            await expect(trigger).toHaveAttribute("aria-expanded", "false");
            await expect(
                page.getByRole("menuitem", {
                    name: "Remove Widget",
                    exact: true,
                })
            ).toHaveCount(0);
            if (key === "Escape") {
                await expect(trigger).toBeFocused();
            }
        });
    }

    test("should close when focus moves outside and preserve mouse confirmation", async ({
        page,
    }) => {
        const trigger = page
            .locator(".nui-widget-header__action-remove button")
            .first();
        await trigger.click();
        const action = page.getByRole("menuitem", {
            name: "Remove Widget",
            exact: true,
        });
        await expect(action).toBeVisible();
        await page
            .locator("button.nui-widget-header__action-edit")
            .first()
            .focus();
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await expect(action).toHaveCount(0);
        const widget = trigger.locator("xpath=ancestor::nui-widget");
        const originalWidget = await widget.elementHandle();
        await trigger.click();
        await action.click();
        await expect
            .poll(() =>
                originalWidget!.evaluate(element => element.isConnected)
            )
            .toBe(false);
        await originalWidget!.dispose();
    });
});
