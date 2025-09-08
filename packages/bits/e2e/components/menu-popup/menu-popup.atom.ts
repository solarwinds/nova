import { Locator } from "playwright-core";

import { Atom } from "../../atom";

export class MenuPopupAtom extends Atom {
    public static CSS_CLASS = "nui-menu-popup";

    public itemByIndex = (idx: number): Locator => this.items.nth(idx);

    public get items(): Locator {
        return super.getLocator().locator(".nui-menu-item");
    }

    public get selectedItems(): Locator {
        return super.getLocator().locator(".nui-menu-item--selected");
    }

    public get selectedItem(): Locator {
        return super.getLocator().locator(".nui-menu-item--selected").first();
    }

    public async clickItemByText(title: string): Promise<void> {
        const items = this.items;
        if ((await items.count()) === 0) {
            return;
        }
        await items.filter({hasText: title}).click();
    }
    public itemByText(title: string): Locator {
        const items = this.items;
        return items.filter({hasText: title});
    }
}
