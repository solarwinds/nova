import { Locator, Page } from "@playwright/test";

import { expect, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

type Surface = "columns" | "items" | "rules";

async function openEditor(page: Page, surface: Surface, prepareSave = false) {
    await Helpers.prepareBrowser(
        surface === "columns" ? "test/table" : "test/kpi",
        page
    );
    const editMode = page
        .getByRole("checkbox", { name: "Edit Mode", exact: true })
        .first();
    if ((await editMode.getAttribute("aria-checked")) !== "true") {
        await editMode.click();
    }
    const edit =
        surface === "columns"
            ? page
                  .locator("nui-widget")
                  .filter({
                      has: page.getByRole("heading", {
                          name: "Table Widget!",
                          exact: true,
                      }),
                  })
                  .locator("button.nui-widget-header__action-edit")
            : page.locator(
                  "nui-widget[widget-id='widget0'] button.nui-widget-header__action-edit"
              );
    await edit.click();
    const dialog = page.getByRole("dialog", {
        name: "Widget configuration",
        exact: true,
    });
    if (prepareSave && surface !== "columns") {
        // The visual fixture has no refresher provider and starts with an invalid zero interval.
        const refresh = dialog.locator("nui-refresher-configuration");
        await refresh.getByRole("button", { name: /^Refresh(?:\s|$)/ }).click();
        await refresh
            .getByRole("checkbox", { name: /^Custom refresh rate/ })
            .click();
        await refresh.locator("nui-textbox-number input").fill("5");
    }
    const root =
        surface === "columns"
            ? dialog.locator(".nui-table-columns-configuration")
            : surface === "items"
            ? dialog.locator(".nui-items-dynamic")
            : dialog
                  .locator("nui-background-color-rules-configuration")
                  .first();
    if (surface === "rules") {
        await root
            .getByRole("button", { name: /^Background color rules(?:\s|$)/ })
            .click();
        for (let i = 0; i < 3; i++) {
            await root
                .getByRole("button", { name: "Add new rule", exact: true })
                .click();
            await root
                .locator("nui-textbox input")
                .nth(i)
                .fill(String(i + 1));
        }
    }
    const rows = root.locator(
        surface === "columns"
            ? ".nui-table-columns-configuration__node-item"
            : surface === "items"
            ? ".nui-items-dynamic__node-item"
            : ".kpi-color-rule"
    );
    const handles = root.getByRole("button", {
        name: `Reorder ${
            surface === "columns"
                ? "column"
                : surface === "items"
                ? "item"
                : "rule"
        }`,
        exact: true,
    });
    await expect.poll(async () => handles.count()).toBeGreaterThan(2);
    return { dialog, root, rows, handles, edit };
}

async function order(rows: Locator, surface: Surface): Promise<string[]> {
    if (surface === "rules") {
        return rows
            .locator("nui-textbox input")
            .evaluateAll(inputs =>
                inputs.map(input => (input as HTMLInputElement).value)
            );
    }
    if (surface === "columns") {
        return (
            await rows
                .locator(".nui-table-columns-configuration__header-text")
                .allTextContents()
        ).map(text => text.trim().replace(/^Column \d+\s*-\s*/, ""));
    }
    return (
        await rows
            .getByRole("button", { name: /^Data Source(?:\s|$)/ })
            .allTextContents()
    ).map(text => text.replace(/\s+/g, " ").trim());
}

for (const surface of ["columns", "items", "rules"] as const) {
    test.describe(`${surface} configurator keyboard reordering`, () => {
        test("keeps mouse appearance and drag reordering unchanged", async ({
            page,
        }) => {
            await page.setViewportSize({ width: 1280, height: 1800 });
            const { root, rows, handles } = await openEditor(page, surface);
            const original = await order(rows, surface);
            const handle = handles.first();
            await handle.hover();
            const pointerAppearance = await handle.screenshot({
                animations: "disabled",
            });
            await handle.click();
            expect(
                (await handle.screenshot({ animations: "disabled" })).equals(
                    pointerAppearance
                )
            ).toBe(true);
            expect(
                await handle.evaluate(element =>
                    element.matches(":focus-visible")
                )
            ).toBe(false);
            if (surface === "rules") {
                const wrapper = await handle.boundingBox();
                const icon = await handle.locator("nui-icon").boundingBox();
                expect(wrapper).toEqual(icon);
            }
            await handles.nth(1).scrollIntoViewIfNeeded();
            const source = (await handles.nth(1).boundingBox())!;
            const target = (await handle.boundingBox())!;
            await page.mouse.move(
                source.x + source.width / 2,
                source.y + source.height / 2
            );
            await page.mouse.down();
            await page.mouse.move(
                source.x + source.width / 2,
                source.y + source.height / 2 - 8,
                { steps: 3 }
            );
            await page.mouse.move(
                target.x + target.width / 2,
                target.y + target.height / 2,
                { steps: 15 }
            );
            await page.mouse.up();
            await expect
                .poll(async () => order(rows, surface))
                .toEqual([original[1], original[0], ...original.slice(2)]);
            await expect(
                root.getByRole("button", { name: /^Reorder /, pressed: true })
            ).toHaveCount(0);
        });

        test("persists keyboard order when saving and reopening the editor", async ({
            page,
        }) => {
            const { dialog, root, rows, handles, edit } = await openEditor(
                page,
                surface,
                true
            );
            const original = await order(rows, surface);
            await handles.first().focus();
            await page.keyboard.press("Enter");
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("Enter");
            const expected = [original[1], original[0], ...original.slice(2)];
            await expect
                .poll(async () => order(rows, surface))
                .toEqual(expected);
            await dialog
                .getByRole("button", { name: "Save Changes", exact: true })
                .click();
            await expect(dialog).toHaveCount(0);
            await edit.click();
            if (surface === "rules") {
                await root
                    .getByRole("button", {
                        name: /^Background color rules(?:\s|$)/,
                    })
                    .click();
            }
            await expect
                .poll(async () => order(rows, surface))
                .toEqual(expected);
        });

        for (const theme of ["light", "dark", "forced-colors"]) {
            test(`retains focus, announces moves and restores order in ${theme}`, async ({
                page,
                runA11yScan,
            }) => {
                const { dialog, root, rows, handles } = await openEditor(
                    page,
                    surface
                );
                await page.emulateMedia({
                    forcedColors: theme === "forced-colors" ? "active" : "none",
                });
                await page.evaluate(
                    dark =>
                        document.documentElement.classList.toggle(
                            "dark-nova-theme",
                            dark
                        ),
                    theme === "dark"
                );
                const original = await order(rows, surface);
                const handle = handles.first();
                await handle.hover();
                await handle.click();
                expect(
                    await handle.evaluate(element =>
                        element.matches(":focus-visible")
                    )
                ).toBe(false);
                await handle.focus();
                await page.keyboard.press("Tab");
                await page.keyboard.press("Shift+Tab");
                await expect(handle).toBeFocused();
                await expect(handle).toHaveCSS("outline-style", "solid");
                await expect(handle).toHaveCSS("outline-width", "2px");
                const actualHandle = await handle.elementHandle();
                await page.keyboard.press("Space");
                await expect(handle).toHaveAttribute("aria-pressed", "true");
                await page.keyboard.press("ArrowDown");
                await expect(
                    root.locator("[aria-live='polite']").first()
                ).toContainText("position 2");
                expect(
                    await actualHandle!.evaluate(
                        element => element === document.activeElement
                    )
                ).toBe(true);
                await page.keyboard.press("ArrowDown");
                await expect(
                    root.locator("[aria-live='polite']").first()
                ).toContainText("position 3");
                await expect(
                    root.getByRole("button", {
                        name: /^Reorder /,
                        pressed: true,
                    })
                ).toBeInViewport({ ratio: 1 });
                await expect
                    .poll(async () => order(rows, surface))
                    .toEqual([
                        original[1],
                        original[2],
                        original[0],
                        ...original.slice(3),
                    ]);
                await page.keyboard.press("Escape");
                await expect(dialog).toBeVisible();
                await expect
                    .poll(async () => order(rows, surface))
                    .toEqual(original);
                await expect(
                    root.locator("[aria-live='polite']").first()
                ).toContainText("Original order restored");
                expect(
                    await actualHandle!.evaluate(
                        element => element === document.activeElement
                    )
                ).toBe(true);
                await expect(
                    root.getByRole("button", {
                        name: /^Reorder /,
                        pressed: true,
                    })
                ).toHaveCount(0);
                const selector =
                    surface === "columns"
                        ? ".nui-table-columns-configuration__drag-handler"
                        : surface === "items"
                        ? ".nui-items-dynamic__drag-handler"
                        : ".kpi-color-rule__drag";
                await runA11yScan(selector);
                await actualHandle!.dispose();
                await dialog
                    .getByRole("button", { name: "Cancel", exact: true })
                    .click();
            });
        }
    });
}
