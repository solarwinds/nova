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
        const firstResizer = firstHeader.getByRole("button");

        for (const theme of ["light", "dark"] as const) {
            await test.step(`Keyboard focus indicator in ${theme} theme`, async () => {
                await Helpers.switchDarkTheme(theme === "dark" ? "on" : "off");
                await expect(firstHeader).toHaveClass(
                    /nui-table__table-header-cell--sortable/
                );
                await expect(firstHeader).toHaveClass(/cdk-table-sticky/);

                // The column-width button is a separate Tab stop within each
                // resizable header.
                await firstHeader.focus();
                await Helpers.page.keyboard.press("Tab");
                await expect(firstResizer).toBeFocused();
                await Helpers.page.keyboard.press("Tab");
                await expect(headers.nth(1)).toBeFocused();
                await Helpers.page.keyboard.press("Shift+Tab");
                await expect(firstResizer).toBeFocused();
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
        await expect(
            headers.nth((await headers.count()) - 2).getByRole("button")
        ).toBeFocused();
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

    test.describe("resizable table column-width editor", () => {
        test.beforeEach(async ({ page }) => {
            await Helpers.prepareBrowser("table/resize", page);
        });

        test("should expose accessible resize buttons for named columns, including nonsortable columns", async () => {
            const table = TableAtom.find<TableAtom>(
                TableAtom,
                "nui-demo-resizable-table"
            );
            const nameResizer = table.getColumnResizer("Name");
            const checksResizer = table.getColumnResizer("Checks");

            await expect(nameResizer).toHaveAttribute(
                "aria-haspopup",
                "dialog"
            );
            await expect(nameResizer).toHaveAttribute("aria-expanded", "false");
            await expect(checksResizer).toBeVisible();
            await expect(
                table
                    .getLocator()
                    .locator("#nui-header-cell-icon .nui-table__resizer")
            ).toHaveCount(0);
        });

        test("should resize every resizable column using only keyboard navigation", async () => {
            const table = TableAtom.find<TableAtom>(
                TableAtom,
                "nui-demo-resizable-table"
            );
            const resizers = table.getResizers();
            await expect(resizers).toHaveCount(7);
            await table.getHeaderCells().first().focus();

            for (const resizer of await resizers.all()) {
                for (let tab = 0; tab < 5; tab++) {
                    await Helpers.page.keyboard.press("Tab");
                    if (
                        await resizer.evaluate(
                            element => element === document.activeElement
                        )
                    ) {
                        break;
                    }
                }
                await expect(resizer).toBeFocused();
                await expect(resizer).toHaveCSS("box-shadow", /inset/);
                const header = resizer.locator("..");
                const sortBefore = await header.getAttribute("aria-sort");
                const columnIndex = await header.evaluate(element => {
                    if (!element.parentElement) {
                        throw new Error("Header row is not present");
                    }
                    return Array.from(element.parentElement.children).indexOf(
                        element
                    );
                });

                await Helpers.page.keyboard.press("Enter");
                const dialog = Helpers.page.getByRole("dialog");
                const input = dialog.getByRole("spinbutton", {
                    name: "Width (px)",
                });
                await expect(input).toBeFocused();
                const width = Number(await input.inputValue()) + 10;
                await input.fill(String(width));
                await Helpers.page.keyboard.press("Enter");

                await expect(dialog).toBeHidden();
                await expect(resizer).toBeFocused();
                await expect(header).toHaveCSS("width", `${width}px`);
                await expect(table.getCell(1, columnIndex)).toHaveCSS(
                    "width",
                    `${width}px`
                );
                expect(await header.getAttribute("aria-sort")).toBe(sortBefore);
            }
        });

        test("should open by Enter or Space, keep Tab within the editor, and close with focus restored", async () => {
            const table = TableAtom.find<TableAtom>(
                TableAtom,
                "nui-demo-resizable-table"
            );
            const resizer = table.getColumnResizer("Name");

            await resizer.focus();
            await Helpers.page.keyboard.press("Enter");
            let dialog = Helpers.page.getByRole("dialog", {
                name: "Column width: Name",
            });
            await expect(dialog).toBeVisible();
            await expect(resizer).toHaveAttribute("aria-expanded", "true");

            const widthInput = dialog.getByRole("spinbutton", {
                name: "Width (px)",
            });
            await expect(widthInput).toBeFocused();
            await Helpers.page.keyboard.press("Tab");
            await expect(
                dialog.getByRole("button", { name: "Cancel" })
            ).toBeFocused();
            await Helpers.page.keyboard.press("Tab");
            await expect(
                dialog.getByRole("button", { name: "Apply" })
            ).toBeFocused();
            await Helpers.page.keyboard.press("Tab");
            await expect(widthInput).toBeFocused();
            await Helpers.page.keyboard.press("Shift+Tab");
            await expect(
                dialog.getByRole("button", { name: "Apply" })
            ).toBeFocused();
            await Helpers.page.keyboard.press("Shift+Tab");
            await expect(
                dialog.getByRole("button", { name: "Cancel" })
            ).toBeFocused();
            await Helpers.page.keyboard.press("Shift+Tab");
            await expect(widthInput).toBeFocused();

            await dialog.getByRole("button", { name: "Cancel" }).click();
            await expect(dialog).toBeHidden();
            await expect(resizer).toBeFocused();
            await expect(resizer).toHaveAttribute("aria-expanded", "false");

            await Helpers.page.keyboard.press("Space");
            dialog = Helpers.page.getByRole("dialog", {
                name: "Column width: Name",
            });
            await expect(dialog).toBeVisible();
            await dialog
                .getByRole("spinbutton", { name: "Width (px)" })
                .fill("700");
            await Helpers.page.keyboard.press("Escape");
            await expect(dialog).toBeHidden();
            await expect(resizer).toBeFocused();
            await expect(resizer).toHaveAttribute("aria-expanded", "false");
            await expect(table.getColumn("Name")).toHaveCSS("width", "400px");

            await resizer.click();
            dialog = Helpers.page.getByRole("dialog", {
                name: "Column width: Name",
            });
            await expect(
                dialog.getByRole("spinbutton", { name: "Width (px)" })
            ).toHaveValue("400");
            await dialog
                .getByRole("spinbutton", { name: "Width (px)" })
                .fill("500");
            await Helpers.page.keyboard.press("Enter");
            await expect(dialog).toBeHidden();
            await expect(resizer).toHaveAttribute("aria-expanded", "false");
            await expect(resizer).toBeFocused();
            await expect(table.getColumn("Name")).toHaveCSS("width", "500px");
            await expect(table.getCell(1, 1)).toHaveCSS("width", "500px");
        });

        test("should not open or sort when tabbing past the resize button", async () => {
            const table = TableAtom.find<TableAtom>(
                TableAtom,
                "nui-demo-resizable-table"
            );
            const resizer = table.getColumnResizer("Name");
            const nameHeader = table.getColumn("Name");
            const sortBefore = await nameHeader.getAttribute("aria-sort");

            await resizer.focus();
            await Helpers.page.keyboard.press("Tab");

            await expect(
                Helpers.page.getByRole("dialog", {
                    name: "Column width: Name",
                })
            ).toBeHidden();
            await expect(resizer).toHaveAttribute("aria-expanded", "false");
            expect(await nameHeader.getAttribute("aria-sort")).toBe(sortBefore);
        });

        test("should render no resize buttons when the table is not resizable", async ({
            page,
        }) => {
            await Helpers.prepareBrowser("table/sorting", page);
            const table = TableAtom.find<TableAtom>(
                TableAtom,
                "nui-demo-sortable-table"
            );
            await expect(table.getResizers()).toHaveCount(0);
        });

        test("should pass axe for the open width editor", async ({
            runA11yScan,
        }) => {
            const table = TableAtom.find<TableAtom>(
                TableAtom,
                "nui-demo-resizable-table"
            );
            await table.getColumnResizer("Name").click();

            await runA11yScan(".nui-table__column-width-editor");
        });

        test("should pass axe for the resize controls", async ({
            runA11yScan,
        }) => {
            await runA11yScan(".nui-table__resizer");
        });

        test("should reject invalid widths and apply the minimum and unbounded values only to the selected column", async () => {
            const table = TableAtom.find<TableAtom>(
                TableAtom,
                "nui-demo-resizable-table"
            );
            const nameHeader = table.getColumn("Name");
            const nameBodyCell = table.getCell(1, 1);
            const featuresHeader = table.getColumn("Features");
            const nameSort = await nameHeader.getAttribute("aria-sort");
            const featuresWidth = await featuresHeader.evaluate(
                element => getComputedStyle(element).width
            );
            const resizer = table.getColumnResizer("Name");

            await resizer.click();
            let dialog = Helpers.page.getByRole("dialog", {
                name: "Column width: Name",
            });
            const widthInput = dialog.getByRole("spinbutton", {
                name: "Width (px)",
            });
            const apply = dialog.getByRole("button", { name: "Apply" });

            await widthInput.fill("");
            await apply.click();
            await expect(dialog.getByRole("alert")).toBeVisible();
            await expect(widthInput).toBeFocused();

            await widthInput.fill("45");
            await apply.click();
            await expect(dialog.getByRole("alert")).toBeVisible();
            await expect(widthInput).toBeFocused();

            await widthInput.fill("46");
            await apply.click();
            await expect(dialog).toBeHidden();
            await expect(nameHeader).toHaveCSS("width", "46px");
            await expect(nameBodyCell).toHaveCSS("width", "46px");
            expect(await nameHeader.getAttribute("aria-sort")).toBe(nameSort);
            await expect(featuresHeader).toHaveCSS("width", featuresWidth);
            await expect(
                nameHeader.locator(".nui-table__column-width-announcement")
            ).toHaveAttribute("role", "status");
            await expect(
                nameHeader.locator(".nui-table__column-width-announcement")
            ).toHaveText("Name column width: 46 pixels");

            await resizer.click();
            dialog = Helpers.page.getByRole("dialog", {
                name: "Column width: Name",
            });
            await expect(
                dialog.getByRole("spinbutton", { name: "Width (px)" })
            ).toHaveValue("46");
            await dialog
                .getByRole("spinbutton", { name: "Width (px)" })
                .fill("1500");
            await dialog.getByRole("button", { name: "Apply" }).click();
            await expect(dialog).toBeHidden();
            await expect(nameHeader).toHaveCSS("width", "1500px");
            await expect(nameBodyCell).toHaveCSS("width", "1500px");
            expect(await nameHeader.getAttribute("aria-sort")).toBe(nameSort);

            await resizer.click();
            dialog = Helpers.page.getByRole("dialog", {
                name: "Column width: Name",
            });
            await expect(
                dialog.getByRole("spinbutton", { name: "Width (px)" })
            ).toHaveValue("1500");
        });

        test("should close on outside click without returning focus to the trigger", async () => {
            const table = TableAtom.find<TableAtom>(
                TableAtom,
                "nui-demo-resizable-table"
            );
            const resizer = table.getColumnResizer("Name");
            const featuresHeader = table.getColumn("Features");

            await resizer.click();
            const dialog = Helpers.page.getByRole("dialog", {
                name: "Column width: Name",
            });
            await expect(dialog).toBeVisible();
            await featuresHeader.click();

            await expect(dialog).toBeHidden();
            await expect(featuresHeader).toBeFocused();
        });

        test("should preserve pointer resizing without opening the editor after a drag", async () => {
            const table = TableAtom.find<TableAtom>(
                TableAtom,
                "nui-demo-resizable-table"
            );
            const nameHeader = table.getColumn("Name");
            const nameBodyCell = table.getCell(1, 1);
            const resizer = table.getColumnResizer("Name");
            const initialWidth = await nameHeader.evaluate(
                element => element.getBoundingClientRect().width
            );
            const box = await resizer.boundingBox();
            if (!box) {
                throw new Error("Column resizer is not visible");
            }

            await Helpers.page.mouse.move(
                box.x + box.width / 2,
                box.y + box.height / 2
            );
            await Helpers.page.mouse.down();
            await Helpers.page.mouse.move(
                box.x + box.width / 2 + 30,
                box.y + box.height / 2
            );
            await Helpers.page.mouse.up();

            await expect
                .poll(() =>
                    nameHeader.evaluate(
                        element => element.getBoundingClientRect().width
                    )
                )
                .toBeCloseTo(initialWidth + 30, 0);
            await expect
                .poll(() =>
                    nameBodyCell.evaluate(
                        element => element.getBoundingClientRect().width
                    )
                )
                .toBeCloseTo(initialWidth + 30, 0);
            await expect(
                Helpers.page.getByRole("dialog", {
                    name: "Column width: Name",
                })
            ).toBeHidden();
        });
    });
});
