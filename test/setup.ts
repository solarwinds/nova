import { test as base, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

type AxeFixture = {
    makeAxeBuilder: () => AxeBuilder;
};

// Extend base test by providing "makeAxeBuilder"
//
// This new "test" can be used in multiple test files, and each of them will get
// a consistently configured AxeBuilder instance.
export const test = base.extend<AxeFixture>({
    makeAxeBuilder: async ({ page }, use) => {
        const makeAxeBuilder = () =>
            new AxeBuilder({ page })
                .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
                .exclude("#commonly-reused-element-with-known-issue");

        await use(makeAxeBuilder);
    },
});
export { expect } from "@playwright/test";

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
