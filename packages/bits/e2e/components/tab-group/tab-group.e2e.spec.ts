import { Atom } from "../../atom";
import { Helpers, expect, test } from "../../setup";
import { TabGroupAtom } from "./tab-group.atom";

test.describe("USERCONTROL tab group", () => {
    for (const theme of ["light", "dark", "forced-colors"]) {
        for (const selector of [
            "#nui-demo-tab-group-overflow",
            "#nui-demo-visual-tabgroup-horizontal",
            "#nui-demo-visual-tabgroup-vertical",
            "#nui-demo-visual-tabgroup-responsive",
        ]) {
            test(`should distinguish keyboard focus from selection in ${selector} (${theme})`, async ({
                page,
            }) => {
                await Helpers.prepareBrowser("tabgroup/tabgroup-test", page);
                await page.emulateMedia({
                    forcedColors: theme === "forced-colors" ? "active" : "none",
                });
                await page.evaluate(isDark => {
                    document.documentElement.classList.toggle(
                        "dark-nova-theme",
                        isDark
                    );
                }, theme === "dark");
                const tabs = page.locator(`${selector} [role='tab']`);
                const activeTab = tabs.first();

                await activeTab.click();
                await expect(activeTab).toHaveAttribute(
                    "aria-selected",
                    "true"
                );
                await expect(activeTab).toHaveCSS("outline-style", "none");
                await page.keyboard.press("Shift+Tab");
                await page.keyboard.press("Tab");
                await expect(activeTab).toBeFocused();
                await expect(activeTab).toHaveCSS("outline-style", "solid");
                await expect(activeTab).toHaveCSS("outline-width", "2px");
                await expect(activeTab).toHaveCSS("outline-offset", "-2px");

                const contrast = await activeTab.evaluate(tab => {
                    const rgb = (color: string): number[] => {
                        const channels = color.match(/[\d.]+/g);
                        if (!channels || channels.length < 3) {
                            throw new Error(`Unsupported color: ${color}`);
                        }
                        return channels.map(Number);
                    };
                    const luminance = (channels: number[]): number =>
                        channels
                            .slice(0, 3)
                            .map(value => {
                                const channel = value / 255;
                                return channel <= 0.04045
                                    ? channel / 12.92
                                    : ((channel + 0.055) / 1.055) ** 2.4;
                            })
                            .reduce(
                                (sum, value, index) =>
                                    sum +
                                    value * [0.2126, 0.7152, 0.0722][index],
                                0
                            );
                    const layers: number[][] = [];
                    let element: Element | null =
                        tab.querySelector(".tab-link") ?? tab;
                    while (element) {
                        layers.push(
                            rgb(getComputedStyle(element).backgroundColor)
                        );
                        element = element.parentElement;
                    }
                    const background = layers.reverse().reduce(
                        (under, over) => {
                            const alpha = over[3] ?? 1;
                            return under.map(
                                (channel, index) =>
                                    over[index] * alpha + channel * (1 - alpha)
                            );
                        },
                        [255, 255, 255]
                    );
                    const foreground = rgb(getComputedStyle(tab).outlineColor);
                    const light = luminance(background);
                    const dark = luminance(foreground);
                    return (
                        (Math.max(light, dark) + 0.05) /
                        (Math.min(light, dark) + 0.05)
                    );
                });
                expect(contrast).toBeGreaterThanOrEqual(3);

                await page.keyboard.press(
                    selector.includes("vertical") ? "ArrowDown" : "ArrowRight"
                );
                await expect(tabs.nth(1)).toBeFocused();
                await expect(tabs.nth(1)).toHaveCSS("outline-style", "solid");
                await expect(tabs.nth(1)).not.toHaveAttribute(
                    "aria-selected",
                    "true"
                );
                await expect(activeTab).toHaveAttribute(
                    "aria-selected",
                    "true"
                );
                await expect(activeTab).toHaveCSS("outline-style", "none");
            });
        }
    }

    test("should keep overflowing tabs visible during keyboard navigation", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("tabgroup/tabgroup-test", page);
        const group = Atom.findIn<TabGroupAtom>(
            TabGroupAtom,
            page.locator("#nui-demo-tab-group-overflow")
        );
        const tabs = group.getTabs();
        await expect(tabs).toHaveCount(10);
        await tabs.first().focus();
        const scrollY = await page.evaluate(() => window.scrollY);

        for (let index = 1; index < 10; index++) {
            await page.keyboard.press("ArrowRight");
            await expect(tabs.nth(index)).toBeFocused();
            await group.toHaveTabInView(tabs.nth(index));
        }

        await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
        await expect(tabs.last()).not.toHaveAttribute("aria-selected", "true");
        await page.keyboard.press("Home");
        await expect(tabs.first()).toBeFocused();
        await group.toHaveTabInView(tabs.first());
        await page.keyboard.press("End");
        await expect(tabs.last()).toBeFocused();
        await group.toHaveTabInView(tabs.last());
        await page.keyboard.press("Enter");
        await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
        expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    });
});
