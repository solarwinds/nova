import AxeBuilder from "@axe-core/playwright";
import { expect, JSHandle, Page, test as base } from "@playwright/test";

import { Atom } from "./atom";

export enum Animations {
    ALL,
    TRANSITIONS,
    TRANSFORMS,
    ANIMATIONS,
    TRANSFORMS_AND_ANIMATIONS,
    TRANSITIONS_AND_ANIMATIONS,
    TRANSITIONS_AND_TRANSFORMS,
}

interface AxeFixture {
    runA11yScan: (
        context?: string | any,
        disabledRules?: string[]
    ) => Promise<void>;
}

export { expect } from "@playwright/test";

export const test = base.extend<AxeFixture>({
    runA11yScan: async ({ page }, use) => {
        await use(async (context?: any | string, disabledRules = []) => {
            const builder = new AxeBuilder({ page }).withTags([
                "wcag2a",
                "wcag21a",
                "wcag21aa",
                "wcag22a",
                "wcag22aa",
            ]);
            if (context) {
                const locator =
                    typeof context === "string"
                        ? context
                        : Atom.getSelector(context);
                if (locator != null) {
                    await expect(page.locator(locator).first()).toBeVisible();
                }
                builder.include(locator ?? "");
            }

            const results = await builder.disableRules(disabledRules).analyze();
            expect(results.violations).toEqual([]);
        });
    },
});

export class Helpers {
    public static page: Page;
    public static setPage(page: Page): void {
        this.page = page;
    }

    static async getActiveElement(): Promise<JSHandle | null> {
        return await test.step("Get active element", async () => Helpers.page.evaluateHandle(() => document.activeElement));
    }

    static async prepareBrowser(pageName: string, page: Page): Promise<void> {
        await test.step(`Prepare browser for page: ${pageName}`, async () => {
            Helpers.setPage(page);
            await Helpers.page.goto(`#/${pageName}`); // Update path as needed
        });
    }

    static async clickOnEmptySpace(): Promise<void> {
        await test.step("Click on empty space", async () => {
            await Helpers.page.click("body", { position: { y: 0, x: 0 } });
        });
    }

    static async setLocation(url: string): Promise<void> {
        await test.step(`Set location to: ${url}`, async () => {
            await this.page.goto(url);
        });
    }

    static async pressKey(key: string, times = 1): Promise<void> {
        await test.step(`Press key ${key} x${times}`, async () => {
            for (let i = 0; i < times; i++) {
                await Helpers.page.keyboard.press(key);
            }
        });
    }
    static async evaluateActiveElementHtml(): Promise<string | null> {
        return await test.step("Evaluate active element innerHTML", async () => Helpers.page.evaluate(() => {
                const el = document.activeElement;
                return el ? el.innerHTML : null;
            }));
    }

    static async disableCSSAnimations(type: Animations): Promise<any> {
        return await test.step(`Disable CSS animations: ${Animations[type]}`, async () => {
            let disableTransitions =
                "-o-transition-property: none !important;" +
                "-moz-transition-property: none !important;" +
                "-ms-transition-property: none !important;" +
                "-webkit-transition-property: none !important;" +
                "transition-property: none !important;";

            let disableTransforms =
                "-o-transform: none !important;" +
                "-moz-transform: none !important;" +
                "-ms-transform: none !important;" +
                "-webkit-transform: none !important;" +
                "transform: none !important;";

            let disableAnimations =
                "-webkit-animation: none !important;" +
                "-moz-animation: none !important;" +
                "-o-animation: none !important;" +
                "-ms-animation: none !important;" +
                "animation: none !important;";

            switch (type) {
                case Animations.ALL:
                    break;
                case Animations.TRANSITIONS:
                    disableTransforms = "";
                    disableAnimations = "";
                    break;
                case Animations.TRANSFORMS:
                    disableAnimations = "";
                    disableTransitions = "";
                    break;
                case Animations.ANIMATIONS:
                    disableTransforms = "";
                    disableTransitions = "";
                    break;
                case Animations.TRANSFORMS_AND_ANIMATIONS:
                    disableTransitions = "";
                    break;
                case Animations.TRANSITIONS_AND_ANIMATIONS:
                    disableTransforms = "";
                    break;
                case Animations.TRANSITIONS_AND_TRANSFORMS:
                    disableAnimations = "";
                    break;
            }

            const css =
                "*, *:before, *:after {" +
                disableTransitions +
                disableTransforms +
                disableAnimations +
                "}";

            return Helpers.page.addInitScript(`
                var head = document.head || document.getElementsByTagName("head")[0];
                                var style = document.createElement("style");
                                style.type = "text/css";
                                style.appendChild(document.createTextNode("${css}"));
                head.appendChild(style);
            `);
        });
    }

    static async switchDarkTheme(mode: "on" | "off"): Promise<void> {
        await test.step(`Switch dark theme: ${mode}`, async () => {
            await Helpers.page.evaluate((themeMode) => {
                const html = document.getElementsByTagName("html")[0];
                if (themeMode === "on") {
                    html.classList.add("dark-nova-theme");
                } else {
                    html.classList.remove("dark-nova-theme");
                }
            }, mode);
        });
    }

    /**
     * Apply a browser zoom via CSS zoom to stabilize visual snapshots.
     * Works in Chromium-based engines used by Playwright.
     * @param percent Zoom percentage (e.g., 100 = default, 55 = zoomed out)
     */
    static async browserZoom(percent: number): Promise<void> {
        await test.step(`browserZoom(${percent}%)`, async () => {
            await Helpers.page.evaluate(
                (num) => (document.body.style.zoom = `${num}%`),
                percent
            );
        });
    }

    /**
     * Reset browser zoom to default (100%).
     */
    static async resetBrowserZoom(): Promise<void> {
        await test.step("resetBrowserZoom", async () => {
            await Helpers.page.evaluate(() => (document.body.style.zoom = ``));
        });
    }
}
