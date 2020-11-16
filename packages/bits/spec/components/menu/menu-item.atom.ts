import { browser, by } from "protractor";

import { Atom } from "../../atom";

const MENU_ACTION_SELECTOR = "nui-menu-item__action";
const MENU_LINK_SELECTOR = "nui-menu-item__link";
const MENU_OPTION_SELECTOR = "nui-menu-item__option";
const MENU_SWITCH_SELECTOR = "nui-menu-item__switch";
const MENU_ITEM_DISABLED = "nui-menu-item--disabled";
const MENU_ITEM_HEADER = "nui-menu-item--header";
const MENU_ITEM_ACTIVE = "nui-menu-item--active";

export class MenuItemAtom extends Atom {
    public static CSS_CLASS = "nui-menu-item";

    public async getTitle(): Promise<string> { return super.getElement().getText(); }

    public async clickItem(): Promise<void> { return super.getElement().click(); }

    public async isDisabledItem(): Promise<boolean> { return Atom.hasClass(super.getElement(), MENU_ITEM_DISABLED); }

    public async isActiveItem(): Promise<boolean> { return Atom.hasClass(super.getElement(), MENU_ITEM_ACTIVE); }

    public async isHeaderItem(): Promise<boolean> { return Atom.hasClass(super.getElement(), MENU_ITEM_HEADER); }

    public async isActionItem(): Promise<boolean> { return super.getElement().element(by.className(MENU_ACTION_SELECTOR)).isPresent(); }

    public async isLinkItem(): Promise<boolean> { return super.getElement().element(by.className(MENU_LINK_SELECTOR)).isPresent(); }

    public async isOptionItem(): Promise<boolean> { return super.getElement().element(by.className(MENU_OPTION_SELECTOR)).isPresent(); }

    public async isSwitchItem(): Promise<boolean> { return super.getElement().element(by.className(MENU_SWITCH_SELECTOR)).isPresent(); }
}
