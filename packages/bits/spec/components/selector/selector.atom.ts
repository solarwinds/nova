import { browser, by, ElementFinder, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { CheckboxAtom } from "../checkbox/checkbox.atom";
import { MenuPopupAtom } from "../menu-popup/menu-popup.atom";
import { PopupAtom } from "../popup/popup.atom";
import { SelectionType } from "./selector.e2e";

export class SelectorAtom extends Atom {
    public static CSS_CLASS = "nui-selector";

    public getPopupAtom(): PopupAtom {
        return Atom.findIn(PopupAtom, this.getElement());
    }

    public async select(selectionType: SelectionType): Promise<void> {
        if (!(await this.isOpened())) {
            await this.getToggle().click();
        }

        return await this.clickItemByText(selectionType);
    }

    public async selectAppendedToBodyItem(
        selectionType: SelectionType
    ): Promise<void> {
        if (!(await this.getPopupAtom().isOpenedAppendToBody())) {
            await this.getToggle().click();
        }
        const menuPopup = Atom.findIn(
            MenuPopupAtom,
            this.getElement().element(by.className("nui-menu-popup"))
        ).getElement();
        await browser.wait(ExpectedConditions.stalenessOf(menuPopup), 3000); // this is mostly for table. 1000ms may be not enough
        return await this.clickAppendedToBodyItemByText(selectionType);
    }

    public getCheckbox(): CheckboxAtom {
        return Atom.findIn(CheckboxAtom, this.getElement());
    }

    public getSelectorButton(): ButtonAtom {
        const buttonContainer = super
            .getElement()
            .element(by.className("nui-selector__checkbox-button"));
        return Atom.findIn(ButtonAtom, buttonContainer);
    }

    public async clickItemByText(title: string) {
        return Atom.findIn(
            MenuPopupAtom,
            this.getElement().element(by.className("nui-menu-popup"))
        ).clickItemByText(title);
    }

    public async clickAppendedToBodyItemByText(title: string) {
        return Atom.findIn(
            MenuPopupAtom,
            browser.element(by.css("body .nui-overlay .nui-menu-popup"))
        ).clickItemByText(title);
    }

    private getToggle(): ElementFinder {
        return this.getElement().element(by.css(".nui-selector__toggle"));
    }

    private async isOpened(): Promise<boolean> {
        return this.getPopupAtom().isOpened();
    }
}
