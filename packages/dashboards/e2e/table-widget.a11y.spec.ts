// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import type { Locator, Page } from "@playwright/test";

import { expect, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

const tableWidgetTitle = "Table Widget!";

const rulesToDisable: string[] = [
    "duplicate-id", // The demo reuses the paginator id across table widgets.
    "aria-allowed-role", // Existing table markup is tracked by NUI-6015.
    "aria-required-parent", // Existing table markup is tracked by NUI-6133.
    "nested-interactive", // The demo table renders links inside interactive rows.
];

function getTargetTableWidget(page: Page): Locator {
    return page.locator("nui-widget").filter({
        has: page.getByRole("heading", {
            name: tableWidgetTitle,
            exact: true,
        }),
    });
}

function getTargetViewport(page: Page): Locator {
    return getTargetTableWidget(page).locator(
        ".nui-table-widget-container cdk-virtual-scroll-viewport"
    );
}

test.describe("a11y: table widget", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("test/table", page);
    });

    test("should have no accessibility violations", async ({ runA11yScan }) => {
        await runA11yScan(".nui-table-widget", rulesToDisable);
    });

    test("should scroll the overflowing viewport with the keyboard", async ({
        page,
    }) => {
        await page.mouse.move(0, 0);

        const viewport = getTargetViewport(page);

        await expect(viewport).toBeVisible();
        await expect(viewport).toHaveAttribute("tabindex", "0");
        await expect(viewport).toHaveAttribute("role", "region");
        await expect(viewport).toHaveAccessibleName(
            `${tableWidgetTitle} Data table`
        );
        await expect
            .poll(async () =>
                viewport.evaluate(
                    element => element.scrollHeight > element.clientHeight
                )
            )
            .toBe(true);

        await viewport.evaluate(() => {
            const activeElement = document.activeElement;
            if (activeElement instanceof HTMLElement) {
                activeElement.blur();
            }
        });

        let isViewportFocused = await viewport.evaluate(
            element => element === document.activeElement
        );
        for (
            let tabPresses = 0;
            tabPresses < 30 && !isViewportFocused;
            tabPresses++
        ) {
            await page.keyboard.press("Tab");
            isViewportFocused = await viewport.evaluate(
                element => element === document.activeElement
            );
        }
        expect(isViewportFocused).toBe(true);

        await expect(viewport).not.toHaveClass(
            /(^|\s)virtual-scroll-disabled(\s|$)/
        );

        const initialScrollTop = await viewport.evaluate(
            element => element.scrollTop
        );
        await page.keyboard.press("ArrowDown");
        await expect
            .poll(async () => viewport.evaluate(element => element.scrollTop))
            .toBeGreaterThan(initialScrollTop);

        const isHorizontallyScrollable = await viewport.evaluate(
            element => element.scrollWidth > element.clientWidth
        );
        if (isHorizontallyScrollable) {
            const initialScrollLeft = await viewport.evaluate(
                element => element.scrollLeft
            );
            await page.keyboard.press("ArrowRight");
            await expect
                .poll(async () =>
                    viewport.evaluate(element => element.scrollLeft)
                )
                .toBeGreaterThan(initialScrollLeft);
        }
    });
});
