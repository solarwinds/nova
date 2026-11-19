// © 2026 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

import AxeBuilder from "@axe-core/playwright";

import { expect, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

test.describe("opt-in keyboard tooltip navigation", () => {
    test("navigates aligned line-series data, dismisses, and preserves pointer tooltips", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("plugins/tooltips/line", page);

        const chart = page.getByRole("img", {
            name: "Response time by date",
        });
        const tooltipPanes = page
            .locator(".nui-chart-tooltip-pane")
            .filter({ visible: true });

        await expect(chart).toHaveAttribute("tabindex", "0");
        await chart.hover();
        await expect(tooltipPanes).toHaveCount(2);

        // Enter the opt-in chart through the real keyboard tab sequence,
        // accounting for any focusable demo-shell controls before the chart.
        let reachedChartByTab = false;
        for (
            let tabPress = 0;
            tabPress < 30 && !reachedChartByTab;
            tabPress++
        ) {
            await page.keyboard.press("Tab");
            reachedChartByTab = await chart.evaluate(
                element => document.activeElement === element
            );
        }
        expect(reachedChartByTab).toBe(true);
        await expect(chart).toBeFocused();
        await expect
            .poll(async () =>
                chart.evaluate(element => getComputedStyle(element).boxShadow)
            )
            .not.toBe("none");

        const expectTooltipValues = async (
            expectedValues: number[]
        ): Promise<void> => {
            await expect(tooltipPanes).toHaveCount(2);
            await expect(tooltipPanes.locator(".pl-2")).toHaveText(
                expectedValues.map(String)
            );
            await expect(tooltipPanes.locator("nui-chart-marker")).toHaveCount(
                2
            );

            await expect
                .poll(async () => {
                    const legendText = (
                        await page
                            .locator("nui-rich-legend-tile")
                            .allTextContents()
                    ).join(" ");
                    return expectedValues.every(value =>
                        new RegExp(`\\b${value}\\b`).test(legendText)
                    );
                })
                .toBe(true);
        };

        await expectTooltipValues([30, 60]);
        const markers = chart.locator("g.marker");
        await expect(markers).toHaveCount(2);
        const initialPositions = await markers.evaluateAll(elements =>
            elements.map(element => element.getAttribute("transform"))
        );

        await page.keyboard.press("ArrowRight");
        await expectTooltipValues([95, 40]);
        await expect
            .poll(async () =>
                markers.evaluateAll(elements =>
                    elements.map(element => element.getAttribute("transform"))
                )
            )
            .not.toEqual(initialPositions);

        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");
        await expectTooltipValues([35, 90]);

        await page.keyboard.press("Escape");
        await expect(tooltipPanes).toHaveCount(0);
        await page.keyboard.press("ArrowRight");
        await expectTooltipValues([35, 90]);

        await page.keyboard.press("Tab");
        await expect(chart).not.toBeFocused();
        await expect(tooltipPanes).toHaveCount(0);

        // Pointer interaction remains available after keyboard highlighting.
        await chart.hover();
        await expectTooltipValues([15, 70]);
    });

    test("has no automated accessibility violations with keyboard tooltips open", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("plugins/tooltips/line", page);
        const chart = page.getByRole("img", { name: "Response time by date" });
        await chart.press("ArrowRight");
        await expect(chart).toBeFocused();
        await expect(page.locator("nui-chart-tooltip")).toHaveCount(2);
        const results = await new AxeBuilder({ page })
            .include("nui-line-chart-with-tooltips-example")
            .include(".nui-chart-tooltip-pane")
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .analyze();
        expect(results.violations).toEqual([]);
    });

    test("does not add a tab stop to the non-opt-in bar chart", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("plugins/tooltips/bar", page);

        const chart = page.locator("nui-chart").first();
        await expect(chart).not.toHaveAttribute("tabindex");
    });
});
