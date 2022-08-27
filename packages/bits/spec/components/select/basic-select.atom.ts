import { by, ElementArrayFinder, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { MenuItemAtom } from "../menu/menu-item.atom";
import { MenuAtom } from "../menu/menu.atom";

export class BasicSelectAtom extends Atom {
    public toggleMenu = async (): Promise<void> => this.getMenu().toggleMenu();

    /**
     * Toggle select and select a new item from the options.
     */
    // Have to click (toggle the repeat) first because you can't interact with hidden elements
    public select = async (title: string): Promise<void> =>
        this.toggleMenu().then(async () =>
            this.getMenu().getMenuItemByContainingText(title).clickItem()
        );

    public getSelectedItem = (): ElementFinder =>
        this.getElement().element(by.className("item-selected"));

    public getSelectedItems = (): ElementArrayFinder =>
        this.getElement().all(by.css(".item-selected"));

    public elementHasClass = async (selector: string, className: string) => {
        const elementClassList = await this.getElementByClass(
            selector
        ).getAttribute("class");
        return elementClassList.includes(className);
    };

    public getItemsCount = async () => this.getMenu().itemCount();

    public getItemText = async (idx: number): Promise<string> =>
        this.getMenuItem(idx).getTitle();

    public getMenu = (): MenuAtom => Atom.findIn(MenuAtom, this.getElement());

    public getElementByClass = (className: string): ElementFinder =>
        this.getElement().element(by.className(className));

    protected getElementByTagName = (tagName: string): ElementFinder =>
        this.getElement().element(by.tagName(tagName));

    protected getElementByCss = (selector: string): ElementFinder =>
        this.getElement().element(by.css(selector));

    protected getElementsByCss = (selector: string): ElementArrayFinder =>
        this.getElement().all(by.css(selector));

    private getMenuItem = (idx: number): MenuItemAtom =>
        this.getMenu().getMenuItemByIndex(idx);
}
