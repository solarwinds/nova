import { expect, Page } from "@playwright/test";

/** Wait for font loading, axis overflow processing, and resize-driven redraws before visual capture. */
export async function waitForChartLayout(page: Page): Promise<void> {
    await page.evaluate(async () => document.fonts.ready);
    const charts = page.locator("nui-chart svg.nui-chart");
    await expect(charts.first()).toBeVisible();

    let previousLayout = "";
    let stableSamples = 0;
    await expect
        .poll(
            async () => {
                const layout = await charts.evaluateAll(elements => {
                    if (
                        elements.some(
                            element =>
                                element.getBoundingClientRect().width === 0 ||
                                element.getBoundingClientRect().height === 0 ||
                                element.querySelector(
                                    ".sw-axis.tick-hidden-text"
                                )
                        )
                    ) {
                        return "";
                    }
                    return JSON.stringify(
                        elements.map(element => ({
                            bounds: element.getBoundingClientRect().toJSON(),
                            content: element.innerHTML,
                        }))
                    );
                });
                stableSamples =
                    layout && layout === previousLayout ? stableSamples + 1 : 0;
                previousLayout = layout;
                return stableSamples >= 2;
            },
            {
                message: "Chart axes and dimensions must settle before capture",
                intervals: [100],
            }
        )
        .toBe(true);
}
