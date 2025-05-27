import AxeBuilder from "@axe-core/playwright";
import { test as base, Page, expect } from "@playwright/test";

import { Atom } from "./atom";

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

                builder.include(locator);
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

    static async prepareBrowser(pageName: string, page: Page): Promise<void> {
        Helpers.setPage(page);
        await Helpers.page.goto(`#/${pageName}`); // Update path as needed
    }

    static async clickOnEmptySpace(): Promise<void>{
        await Helpers.page.click("body", { position: { y: 0, x: 0 } });
    }
}
