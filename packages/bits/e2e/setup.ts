import AxeBuilder from "@axe-core/playwright";
import {expect, JSHandle, Page, test as base} from "@playwright/test";

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
                "wcag2aa",
            ]);

            if (context) {
                const locator =
                    typeof context === "string"
                        ? context
                        : Atom.getSelector(context);

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
        return await Helpers.page.evaluateHandle(() => document.activeElement);
    }

    static async prepareBrowser(pageName: string, page: Page): Promise<void> {
        Helpers.setPage(page);
        await Helpers.page.goto(`#/${pageName}`); // Update path as needed
    }

    static async clickOnEmptySpace(): Promise<void>{
        await Helpers.page.click("body", { position: { y: 0, x: 0 } });
    }

    static async setLocation(url: string): Promise<void>{
        await this.page.goto(url);
    }

    static async pressKey(key: string, times = 1): Promise<void> {
        for (let i = 0; i < times; i++) {
            await Helpers.page.keyboard.press(key);
        }
    }

    static async disableCSSAnimations(type: Animations): Promise<any> {
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
    }

}
