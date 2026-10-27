import { Atom } from "../../atom";
import { Helpers, expect, test } from "../../setup";
import { TabGroupAtom } from "./tab-group.atom";

test.describe("a11y: overflowing tab group", () => {
    test("should expose every tab after keyboard navigation", async ({
        page,
        runA11yScan,
    }) => {
        await Helpers.prepareBrowser("tabgroup/tabgroup-test", page);
        const group = Atom.findIn<TabGroupAtom>(
            TabGroupAtom,
            page.locator("#nui-demo-tab-group-overflow")
        );
        const tabs = group.getTabs();
        await tabs.first().focus();
        await page.keyboard.press("End");
        await expect(tabs.last()).toBeFocused();
        await group.toHaveTabInView(tabs.last());
        await runA11yScan("#nui-demo-tab-group-overflow", ["color-contrast"]);
    });
});
