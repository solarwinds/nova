import {
    browser,
    by,
    element,
    ElementFinder
} from "protractor";

import { Atom } from "../../atom";

export class DialogAtom extends Atom {
    public static CSS_CLASS = "modal-dialog";
    public static BACKDROP_CSS_CLASS = "dialog-backdrop";
    public static DIALOG_WINDOW_CSS_CLASS = "nui-dialog";

    // Dismiss a dialog by clicking on 'X' button

    public static async dismissDialog(): Promise<void> {
        return new DialogAtom(element(by.className("modal-dialog"))).getCloseButton().click();
    }

    public static async clickCancelButton(): Promise<void> {
        return new DialogAtom(element(by.className("modal-dialog"))).getCancelButton().click();
    }

    public static async clickActionButton(): Promise<void> {
        return new DialogAtom(element(by.className("modal-dialog"))).getActionButton().click();
    }

    public isDialogDisplayed = async (): Promise<boolean> => this.getDialog().isPresent();

    public getCloseButton = (): ElementFinder => this.getHeader().element(by.css(".nui-button[icon='close']"));

    public getHeader(): ElementFinder { return super.getElement().element(by.className("dialog-header")); }

    public getFooter(): ElementFinder { return super.getElement().element(by.className("dialog-footer")); }

    public getCancelButton(): ElementFinder { return super.getElement().element(by.className("btn-default")); }

    public getActionButton(): ElementFinder { return super.getElement().element(by.className("btn-primary")); }

    public scrollToEnd = async (): Promise<void> => browser.executeScript<void>(`arguments[0].scrollIntoView({block: "end"})`, this.getDialog());

    public getDialog(): ElementFinder { return super.getElement().element(by.className("modal-dialog")); }

}
