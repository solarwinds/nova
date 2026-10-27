import { Atom } from "../../atom";
import { Helpers, expect, test } from "../../setup";
import { TabGroupAtom } from "./tab-group.atom";

test.describe("USERCONTROL tab group", () => {
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
