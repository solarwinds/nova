import {
    by,
    ElementArrayFinder,
    ElementFinder,
} from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { MenuPopupAtom } from "../menu-popup/menu-popup.atom";
import {OverlayAtom} from "../overlay/overlay.atom";



export class SorterAtom extends Atom {
    public static CSS_CLASS = "nui-sorter";

    public menuPopup: MenuPopupAtom = Atom.findIn(MenuPopupAtom, this.getElement().element(by.className("nui-menu-popup")));
    public click = async (): Promise<void> => this.getToggleElement().click();

    /**
     * Toggle sorter and select a new item from the options.
     */
    public async select(title: string): Promise<void> {
        // Have to click (toggle the repeat) first because
        // you can't interact with hidden elements.
        await this.click();
        return this.getItemByText(title);
    }

    public getItemByIndex = (index: number): ElementFinder => this.getItems().get(index);

    public getNumberOfItems = async (): Promise<number> => this.getItems().count();

    public async getItemText(idx: number): Promise<string> {
        const item = this.getItemByIndex(idx);
        return item.getAttribute("innerText").then((text: string) => text.trim());
    }

    public getItemByText = async (title: string): Promise<void> => this.menuPopup.clickItemByText(title);

    public async getCaptionText(): Promise<string> {
        const item = this.getLabelElement();
        return item.getAttribute("innerText");
    }

    /**
     * To manipulate with sorter button.
     */
    public getSorterButton(): ButtonAtom {
        return Atom.findIn(ButtonAtom, this.getElement().element(by.className("nui-sorter__toggle-button")));
    }

    /**
     * @returns {string} The value displayed in sorter.
     */
    public getCurrentValue = async (): Promise<string> => this.getMainTitleElement().getText();

    public getLabelElement(): ElementFinder { return super.getElement().element(by.className("nui-sorter__label")); }

    public getItems = (): ElementArrayFinder => this.menuPopup.getItems();

    public getSelectedItems = (): ElementArrayFinder => this.menuPopup.getSelectedItems();

    public isPopupDisplayed = () => Atom.findIn(OverlayAtom, this.getElement()).isOpened();

    // private helpers
    private getToggleElement(): ElementFinder { return super.getElement().element(by.className("nui-selector__toggle")); }

    private getMainTitleElement(): ElementFinder { return super.getElement().element(by.className("nui-sorter__display-value")); }
}
