import { Locator } from "@playwright/test";

import { Atom } from "../../atom";
import { expect } from "../../setup";

export class TabGroupAtom extends Atom {
    public static CSS_SELECTOR = "nui-tab-group";

    public getTabs(): Locator {
        return this.getLocator().getByRole("tab");
    }

    public async toHaveTabInView(tab: Locator): Promise<void> {
        await expect
            .poll(() =>
                tab.evaluate(element => {
                    const viewport =
                        element.closest("[role='tablist']")?.parentElement;
                    if (!viewport) {
                        throw new Error("Tab group viewport is missing");
                    }
                    const tabRect = element.getBoundingClientRect();
                    const viewportRect = viewport.getBoundingClientRect();
                    return (
                        tabRect.left >= viewportRect.left - 1 &&
                        tabRect.right <= viewportRect.right + 1
                    );
                })
            )
            .toBe(true);
    }
}
