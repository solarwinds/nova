import {
    browser,
    by,
    ElementArrayFinder,
    ElementFinder,
} from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { PopupAtom } from "../popup/popup.atom";

import { MenuItemAtom } from "./menu-item.atom";

export class MenuAtom extends Atom {
    public static CSS_CLASS = "nui-menu";
    public menuContentId: string;

    private getPopupBox = (): PopupAtom => Atom.findIn(PopupAtom, this.getElement());

    public getMenuButton = (): ButtonAtom => Atom.findIn(ButtonAtom, this.getElement());

    public getMenuButtonIconName = async (): Promise<string | undefined> => this.getMenuButton().getIcon().then(icon =>
        icon?.getName())

    public toggleMenu = async (): Promise<void> => this.getMenuButton().click();

    public getMenuItemByContainingText = (text: string): MenuItemAtom => new MenuItemAtom(this.getElementByCssContainingText(".nui-menu-item", text));

    public itemCount = async (): Promise<number> => this.getItemElements().count();

    public isMenuOpened = async (): Promise<boolean> => this.getPopupBox().isOpened();

    public mouseDownOnMenuButton = async (): Promise<void> => this.getMenuButton().mouseDown();

    public mouseUp = async (): Promise<void> => browser.actions().mouseUp().perform();

    public getMenuItemByIndex = (idx: number): MenuItemAtom => new MenuItemAtom(this.getItemElements().get(idx));

    public getMenuItems = async (): Promise<MenuItemAtom[]> => this.getItemElements().map<MenuItemAtom>(((elementFinder?: ElementFinder) => {
        if (!elementFinder) {
            throw new Error("elementFinder is not defined");
        }
        return new MenuItemAtom(elementFinder);
    }))

    public getItemTextArray = async (): Promise<string[]> =>
        this.getItemElements().map<string>(((elementFinder: ElementFinder | undefined) => elementFinder?.getText()))

    public getHeaderTextArray = async (): Promise<string[]> =>
        this.getHeaderElements().map<string>(((elementFinder: ElementFinder | undefined) => elementFinder?.getText()))

    public clickHeaderByIndex = async (idx: number): Promise<void> => this.getHeaderElements().get(idx).click();

    public clickDividerByIndex = async (idx: number): Promise<void> => this.getElement().all(by.className("nui-divider")).get(idx).click();

    /**
     * Returns array of checked checkboxes
     * @returns {Promise<MenuItemAtom[]>}
     */
    public async getSelectedMenuCheckboxes(): Promise<MenuItemAtom[]> {
        const menuItems = this.getSelectedCheckboxElements();
        const menuItemsCount = await menuItems.count();
        const menuItemsSelected: MenuItemAtom[] = [];

        for (let i = 0; i < menuItemsCount; i++) {
            menuItemsSelected.push(new MenuItemAtom(menuItems.get(i)));
        }

        return menuItemsSelected;
    }

    /**
     * Returns array of checked switches
     * @returns {Promise<MenuItemAtom[]>}
     */
    public async getSelectedMenuSwitches(): Promise<MenuItemAtom[]> {
        const menuItems = this.getSelectedSwitchElements();
        const menuItemsCount = await menuItems.count();
        const menuItemsSelected: MenuItemAtom[] = [];

        for (let i = 0; i < menuItemsCount; i++) {
            menuItemsSelected.push(new MenuItemAtom(menuItems.get(i)));
        }

        return menuItemsSelected;
    }

    public getSelectedCheckboxesCount = async (): Promise<number> => (await this.getSelectedMenuCheckboxes()).length;

    public getSelectedSwitchesCount = async (): Promise<number> => (await this.getSelectedMenuSwitches()).length;

    public getAppendToBodyMenu = (): ElementFinder => browser.element(by.id(this.menuContentId));

    public getAppendToBodyMenuDividers = (): ElementArrayFinder => this.getAppendToBodyMenu().all(by.className("nui-menu-group-divider--container"));

    private getItemElements(): ElementArrayFinder {
        const parentElement = this.menuContentId ? this.getAppendToBodyMenu() : super.getElement();
        return parentElement.all(by.css(".nui-menu-item:not(.nui-menu-item--header)"));
    }

    private getHeaderElements = (): ElementArrayFinder => super.getElement().all(by.css(".nui-menu-item--header"));

    private getSelectedCheckboxElements = (): ElementArrayFinder => super.getElement().all(by.css(".nui-checkbox--checked"));

    private getSelectedSwitchElements = (): ElementArrayFinder => super.getElement().all(by.css(".nui-switched"));

    private getElementByCssContainingText = (selector: string, text: string): ElementFinder =>
        this.getElement().all(by.cssContainingText(selector, text)).first()
}
