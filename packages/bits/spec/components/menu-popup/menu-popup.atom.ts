import {
    by,
    ElementArrayFinder,
    ElementFinder
} from "protractor";

import { Atom } from "../../atom";

export class MenuPopupAtom extends Atom {
    public static CSS_CLASS = "nui-menu-popup";

    public click = async (idx: number): Promise<void> => this.getItemByIndex(idx).click();

    public getItemByIndex = (idx: number): ElementFinder => this.getItems().get(idx);

    public getItems(): ElementArrayFinder { return super.getElement().all(by.className("nui-menu-item")); }

    public getSelectedItems(): ElementArrayFinder { return super.getElement().all(by.className("nui-menu-item--selected")); }

    public getSelectedItem(): ElementFinder { return super.getElement().element(by.className("nui-menu-item--selected")); }

    public async clickItemByText(title: string): Promise<void> {
        const allItems: any = await this.getItems().getText();
        const itemIndex: number = allItems.findIndex((itemText: string) => itemText === title);
        return this.click(itemIndex);
    }
}
