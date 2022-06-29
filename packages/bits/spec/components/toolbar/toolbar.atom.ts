import { by, ElementArrayFinder } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { MenuAtom } from "../menu/menu.atom";
import { PopupAtom } from "../popup/popup.atom";

export class ToolbarAtom extends Atom {
    public static CSS_CLASS = "nui-toolbar";

    public popup = Atom.findIn(PopupAtom, this.getElement());

    public async isPresent(): Promise<boolean> {
        return super.getElement().isPresent();
    }

    private getAllVisibleItems(): ElementArrayFinder {
        return super.getElement().all(by.css(".nui-toolbar-content__dynamic > .nui-button"));
    }

    public async getAllVisibleItemsCount(): Promise<number> {
        return this.getAllVisibleItems().count();
    }

    public getToolbarItemButton(index: number): ButtonAtom {
        return Atom.findIn(ButtonAtom, this.getAllVisibleItems().get(index));
    }

    public getToolbarMenu(): MenuAtom {
        return Atom.findIn(MenuAtom, this.getElement().element(by.className("nui-menu")));
    }

    public async getToolbarBackground(): Promise<string> {
        return super.getElement().getCssValue("background-color");
    }

    public async getSelectedStateText(): Promise<string> {
        return super.getElement().element(by.className("nui-toolbar-content__select")).getText();
    }

    public getToolbarMessages(): ElementArrayFinder {
        return this.getElement().all(by.tagName("nui-toolbar-message"));
    }

    public async getToolbarMessagesTexts(): Promise<string[]> {
        return await this.getToolbarMessages().map<string>((el) => el?.getText());
    }
}
