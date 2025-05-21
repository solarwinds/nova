import { test as base, Page, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { IAtomClass, Atom } from "./atom";

type AxeFixture = {
    runA11yScan: (
        context?: IAtomClass | string,
        disabledRules?: string[]
    ) => Promise<void>;
};
export { expect } from "@playwright/test";

export const test = base.extend<AxeFixture>({
    runA11yScan: async ({ page }, use) => {
        await use(async (context?: IAtomClass | string, disabledRules = []) => {
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
    public static setPage(page: Page) {
        this.page = page;
    }

    static async prepareBrowser(pageName: string, page?: Page): Promise<void> {
        Helpers.setPage(page);
        await Helpers.page.goto(`#/${pageName}`); // Update path as needed
    }
}
